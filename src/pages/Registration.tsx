import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { eventCards } from "@/components/EventsSection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Home } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";
import paymentImg from "@/assets/events/payment.png";
import { supabase } from "@/supabaseClient";

const memberSchema = z.object({
  full_name: z.string().min(2, "Required"),
  phone: z.string().min(10, "Required"),
  rollNumber: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  college: z.string().min(2, "Required"),
});

const formSchema = z.object({
  teamName: z.string().min(2, "Team name is required."),
  teamSize: z.string().min(1, "Please select team size."),
  members: z.array(memberSchema).min(1).max(4),
  paymentScreenshot: z
    .any()
    .refine((files) => files?.length > 0, "Screenshot required."),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = ["Team", "DETAILS", "PAYMENT", "CONFIRM"];
const DEFAULT_TEAM_SIZE_OPTIONS = [
  ["1", "Solo (1)"],
  ["2", "Duo (2)"],
  ["3", "Trio (3)"],
  ["4", "Squad (4)"],
] as const;
const EVENT_REGISTRATION_TABLES: Record<string, string> = {
  PaperX: "reg_paperx",
  "Canvas Clash": "reg_canvas_clash",
  "Brain and Buzzers": "reg_brain_and_buzzers",
  "Auction Mania": "reg_auction_mania",
  Byteopia: "reg_byteopia",
  Conquest: "reg_conquest",
  "The Gaming Lab: Outbreak edition": "reg_gaming_lab",
  "Mission Impossible": "reg_mission_impossible",
};
const ALLOWED_PAYMENT_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_PAYMENT_FILE_SIZE_BYTES = 1024 * 1024;

const inputCls =
  "bg-black border-2 border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-arcade-pink text-white h-12 text-sm font-mono placeholder:text-zinc-600 w-full px-3 ";

const PixelLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-xs text-zinc-400 uppercase font-semibold tracking-wider">
    {children}
  </p>
);

const PixelInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={`${inputCls} ${className ?? ""}`} {...props} />
  )
);

const normalizeFileNamePart = (value: string) =>
  value.trim().replace(/\s+/g, "_");

const compressImageFile = async (file: File) => {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();

      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error("Unable to read the selected image."));
      nextImage.src = objectUrl;
    });

    const scale = image.width > 1200 ? 1200 / image.width : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to compress the selected image.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const mimeType =
      extension === "jpg" || extension === "jpeg"
        ? "image/jpeg"
        : extension === "webp"
        ? "image/webp"
        : "image/png";

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, mimeType === "image/png" ? undefined : 0.85);
    });

    if (!blob) {
      throw new Error("Unable to compress the selected image.");
    }

    return {
      compressedFile: new File([blob], file.name, { type: mimeType }),
      fileExtension: extension === "jpeg" ? "jpeg" : extension === "jpg" ? "jpg" : extension,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

// Step header bar
const StepBar = ({ current }: { current: number }) => (
  <div className="flex items-center w-full my-2">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-3">
            <div
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 font-mono font-bold text-xs sm:text-sm transition-all ${
                done
                  ? "border-arcade-cyan bg-[#050505] text-arcade-cyan shadow-[2px_2px_0px_#FF2D78]"
                  : active
                  ? "border-arcade-pink bg-[#050505] text-arcade-pink shadow-[2px_2px_0px_#00FFFF]"
                  : "border-zinc-800 bg-zinc-950 text-zinc-600"
              }`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={`font-mono text-[10px] sm:text-xs font-bold tracking-widest hidden sm:block ${
                done ? "text-arcade-cyan" : active ? "text-arcade-pink" : "text-zinc-600"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                done ? "bg-arcade-cyan shadow-[0px_1px_0px_#FF2D78]" : "bg-zinc-800"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// Chunky section card
const ArcadeCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div
    className="border-4 border-arcade-pink bg-zinc-950 shadow-[3px_3px_0px_hsl(var(--arcade-cyan))] rounded-none"
  >
    <div
      className="px-4 py-3 font-mono text-sm font-bold tracking-widest uppercase bg-arcade-pink text-black"
    >
      {title}
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const Registration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventNameFromUrl = searchParams.get("event") || eventCards[0].name;
  const [registrationState, setRegistrationState] = useState(() => ({
    eventName: eventNameFromUrl,
    teamName: "",
    teamSize: "1",
  }));
  const selectedEvent =
    eventCards.find((e) => e.name === registrationState.eventName) || eventCards[0];

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState([
    { full_name: "", phone: "", rollNumber: "", email: "", college: "" },
  ]);
  const [paymentScreenshotPath, setPaymentScreenshotPath] = useState("");
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState("");
  const [paymentUploadState, setPaymentUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [paymentUploadMessage, setPaymentUploadMessage] = useState("");
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const teamSizeOptions =
    selectedEvent.teamSizeOptions ?? DEFAULT_TEAM_SIZE_OPTIONS.map(([value, label]) => ({ value, label }));
  const isTeamSizeLocked = teamSizeOptions.length === 1;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgTextY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgTextY2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: registrationState.teamName,
      teamSize: registrationState.teamSize,
      members: [{ full_name: "", phone: "", rollNumber: "", email: "", college: "" }],
      paymentScreenshot: undefined,
    },
  });

  const teamSize = parseInt(registrationState.teamSize, 10) || 1;
  const allValues = form.watch();

  useEffect(() => {
    setRegistrationState((current) => ({
      ...current,
      eventName: eventNameFromUrl,
    }));
  }, [eventNameFromUrl]);

  useEffect(() => {
    if (selectedEvent.registrationUrl) {
      window.location.assign(selectedEvent.registrationUrl);
    }
  }, [selectedEvent]);

  useEffect(() => {
    const forcedTeamSize = teamSizeOptions[0]?.value;
    if (
      forcedTeamSize &&
      !teamSizeOptions.some((option) => option.value === registrationState.teamSize)
    ) {
      setRegistrationState((current) => ({
        ...current,
        teamSize: forcedTeamSize,
      }));
      form.setValue("teamSize", forcedTeamSize, { shouldValidate: true });
    }
  }, [selectedEvent.name, registrationState.teamSize]);

  useEffect(() => {
    form.setValue("teamName", registrationState.teamName, { shouldValidate: step > 0 });
    form.setValue("teamSize", registrationState.teamSize, { shouldValidate: step > 0 });
  }, [form, registrationState.teamName, registrationState.teamSize, step]);

  useEffect(() => {
    const currentLen = members.length;
    if (teamSize > currentLen) {
      const newMembers = [...members];
      for (let i = currentLen; i < teamSize; i++)
        newMembers.push({ full_name: "", phone: "", rollNumber: "", email: "", college: "" });
      setMembers(newMembers);
      form.setValue("members", newMembers);
    } else if (teamSize < currentLen) {
      const trimmedMembers = members.slice(0, teamSize);
      setMembers(trimmedMembers);
      form.setValue("members", trimmedMembers);
    }
  }, [teamSize]);

  useEffect(() => {
    return () => {
      if (paymentPreviewUrl) {
        URL.revokeObjectURL(paymentPreviewUrl);
      }
    };
  }, [paymentPreviewUrl]);

  const updateMember = (
    index: number,
    field: "full_name" | "rollNumber" | "phone" | "email" | "college",
    value: string
  ) => {
    setMembers((current) => {
      const nextMembers = current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member
      );
      form.setValue("members", nextMembers, { shouldValidate: step > 1 });
      return nextMembers;
    });
  };

  const handlePaymentScreenshotChange = async (
    fileList: FileList | null | undefined,
    onChange: (...event: any[]) => void
  ) => {
    const file = fileList?.[0];

    onChange(fileList);

    form.clearErrors("paymentScreenshot");

    if (!file) {
      if (paymentPreviewUrl) {
        URL.revokeObjectURL(paymentPreviewUrl);
      }
      setPaymentPreviewUrl("");
      setPaymentScreenshotPath("");
      setPaymentUploadState("idle");
      setPaymentUploadMessage("");
      return;
    }

    if (paymentPreviewUrl) {
      URL.revokeObjectURL(paymentPreviewUrl);
      setPaymentPreviewUrl("");
    }

    if (!ALLOWED_PAYMENT_FILE_TYPES.includes(file.type)) {
      setPaymentUploadState("error");
      setPaymentUploadMessage("Only JPG, JPEG, PNG, and WEBP files are allowed.");
      setPaymentScreenshotPath("");
      toast.error("Only JPG, JPEG, PNG, and WEBP files are allowed.");
      form.setError("paymentScreenshot", {
        type: "manual",
        message: "Only JPG, JPEG, PNG, and WEBP files are allowed.",
      });
      onChange(undefined);
      return;
    }

    if (file.size > MAX_PAYMENT_FILE_SIZE_BYTES) {
      setPaymentUploadState("error");
      setPaymentUploadMessage("File too large. Please upload an image under 1MB");
      setPaymentScreenshotPath("");
      toast.error("File too large. Please upload an image under 1MB");
      form.setError("paymentScreenshot", {
        type: "manual",
        message: "File too large. Please upload an image under 1MB",
      });
      onChange(undefined);
      return;
    }

    if (!registrationState.eventName.trim() || !registrationState.teamName.trim()) {
      setPaymentUploadState("error");
      setPaymentUploadMessage("Event name and team name are required before upload.");
      toast.error("Complete Step 1 before uploading the payment screenshot.");
      form.setError("paymentScreenshot", {
        type: "manual",
        message: "Complete Step 1 before uploading the payment screenshot.",
      });
      onChange(undefined);
      return;
    }

    const leadName = members[0]?.full_name?.trim() ?? "";

    if (!leadName) {
      setPaymentUploadState("error");
      setPaymentUploadMessage("Lead member name is required before upload.");
      toast.error("Complete the team lead details before uploading the payment screenshot.");
      form.setError("paymentScreenshot", {
        type: "manual",
        message: "Complete the team lead details before uploading the payment screenshot.",
      });
      onChange(undefined);
      return;
    }

    if (paymentPreviewUrl) {
      URL.revokeObjectURL(paymentPreviewUrl);
    }

    setPaymentUploadState("uploading");
    setPaymentUploadMessage("Compressing and uploading screenshot to secure storage...");
    setPaymentScreenshotPath("");

    try {
      const { compressedFile, fileExtension } = await compressImageFile(file);
      const fileName = `${normalizeFileNamePart(registrationState.eventName)}_${normalizeFileNamePart(
        registrationState.teamName
      )}_${normalizeFileNamePart(leadName)}_${Date.now()}.${fileExtension}`;

      setPaymentPreviewUrl(URL.createObjectURL(compressedFile));

      const { data, error } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, compressedFile, { upsert: false });

      if (error) {
        setPaymentUploadState("error");
        setPaymentUploadMessage(error.message || "Upload failed. Please try again.");
        toast.error("Payment screenshot upload failed.");
        form.setError("paymentScreenshot", {
          type: "manual",
          message: error.message || "Upload failed. Please try again.",
        });
        return;
      }

      setPaymentScreenshotPath(data.path);
      setPaymentUploadState("success");
      setPaymentUploadMessage("Payment screenshot uploaded successfully.");
      toast.success("Payment screenshot uploaded successfully.");
      form.clearErrors("paymentScreenshot");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to compress and upload the image.";

      setPaymentUploadState("error");
      setPaymentUploadMessage(message);
      setPaymentScreenshotPath("");
      toast.error(message);
      form.setError("paymentScreenshot", {
        type: "manual",
        message,
      });
    }
  };

  const goNext = async () => {
    let fields: any[] = [];
    if (step === 0) fields = ["teamName", "teamSize"];
    if (step === 1) {
      const hasEmptyMemberFields = members.some((member) =>
        [
          member.full_name,
          member.rollNumber,
          member.phone,
          member.email,
          member.college,
        ].some((value) => !value.trim())
      );

      if (hasEmptyMemberFields) {
        toast.error("Please fill all member details before continuing.");
        return;
      }

      fields = members.flatMap((_, i) => [
        `members.${i}.full_name`, `members.${i}.phone`,
        `members.${i}.rollNumber`, `members.${i}.email`, `members.${i}.college`,
      ]);
    }
    if (step === 2) {
      fields = ["paymentScreenshot"];

      if (paymentUploadState !== "success" || !paymentScreenshotPath) {
        toast.error("Upload the payment screenshot successfully before continuing.");
        return;
      }
    }

    const valid = await form.trigger(fields as any);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const onSubmit = async (_values: FormValues) => {
    if (isSubmittingRegistration || registrationComplete) {
      return;
    }

    setIsSubmittingRegistration(true);

    try {
      const targetTable = EVENT_REGISTRATION_TABLES[registrationState.eventName];

      if (!targetTable) {
        throw new Error("No registration table is configured for this event.");
      }

      const leadMember = members[0];
      const member2 = members[1];
      const member3 = members[2];
      const member4 = members[3];

      const payload = {
        team_name: registrationState.teamName,
        team_size: teamSize,
        lead_name: leadMember?.full_name ?? null,
        lead_roll: leadMember?.rollNumber ?? null,
        lead_email: leadMember?.email ?? null,
        lead_phone: leadMember?.phone ?? null,
        lead_college: leadMember?.college ?? null,
        member2_name: member2?.full_name ?? null,
        member2_roll: member2?.rollNumber ?? null,
        member2_email: member2?.email ?? null,
        member2_phone: member2?.phone ?? null,
        member2_college: member2?.college ?? null,
        member3_name: member3?.full_name ?? null,
        member3_roll: member3?.rollNumber ?? null,
        member3_email: member3?.email ?? null,
        member3_phone: member3?.phone ?? null,
        member3_college: member3?.college ?? null,
        member4_name: member4?.full_name ?? null,
        member4_roll: member4?.rollNumber ?? null,
        member4_email: member4?.email ?? null,
        member4_phone: member4?.phone ?? null,
        member4_college: member4?.college ?? null,
        payment_screenshot_url: paymentScreenshotPath,
        payment_status: "pending",
      };

      const { error } = await supabase
        .from(targetTable)
        .insert(payload);

      if (error) {
        throw new Error(error.message || "Failed to submit registration.");
      }

      setRegistrationComplete(true);
      toast.success("REGISTRATION COMPLETE!", {
        description: `${registrationState.teamName} registered for ${registrationState.eventName}.`,
        className: "border-2 border-green-500 rounded-none bg-black text-green-400 font-mono",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";

      toast.error("Registration failed.", {
        description: message,
        className: "border-2 border-arcade-pink rounded-none bg-black text-arcade-pink font-mono",
      });
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  if (selectedEvent.registrationUrl) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <p className="font-arcade text-sm text-arcade-yellow text-center">
          Redirecting to registration form...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white font-mono pt-0 relative overflow-hidden"
    >
      {/* ── Background large ghost text (Left) ─────────────────────────────────── */}
      <motion.div
        style={{ y: bgTextY }}
        className="pointer-events-none absolute -left-10 md:left-14 top-[9%] flex flex-col gap-4 md:gap-14  items-start select-none z-0 opacity-[0.04]"
        aria-hidden
      >
        {"PHOS".split("").map((char, i) => (
          <span
            key={`l-${i}`}
            className="font-arcade text-[12vw] md:text-[8vw] leading-[0.7] text-white block"
          >
            {char}
          </span>
        ))}
      </motion.div>

      {/* ── Background large ghost text (Right) ─────────────────────────────────── */}
      <motion.div
        style={{ y: bgTextY2 }}
        className="pointer-events-none absolute -right-10 md:right-14 top-[29%] flex flex-col gap-4 md:gap-14 items-end select-none z-0 opacity-[0.04]"
        aria-hidden
      >
        {"ADSOP".split("").map((char, i) => (
          <span
            key={`r-${i}`}
            className="font-arcade text-[12vw] md:text-[8vw] leading-[0.7] text-white block"
          >
            {char}
          </span>
        ))}
      </motion.div>
      {/* Retro Dotted / Static Noise Matrix */}
      <div
        className="fixed inset-0 pointer-events-none z-[0] opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #3f3f46 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Subtle Scanlines overlay (No glow, pure CSS bars) */}
      <div className="fixed inset-0 pointer-events-none z-[0] bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] opacity-50"></div>

      <nav className="relative z-20 border-b-2 border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-none text-xs h-10 px-4 flex items-center gap-2 font-mono font-bold tracking-widest text-zinc-400"
            onClick={() => navigate("/")}
          >
            <Home size={14} />
            <span className="hidden sm:inline">RETURN</span>
          </Button>

          <img src={logo} alt="Adsophos" className="h-20 object-contain" />
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <StepBar current={step} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* STEP 0 — Squad */}
                {step === 0 && (
                  <ArcadeCard title="01 — Squad Setup">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name="teamName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1 space-y-0">
                            <PixelLabel>Team Name</PixelLabel>
                            <FormControl>
                              <PixelInput
                                placeholder="Team Name..."
                                {...field}
                                value={registrationState.teamName}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setRegistrationState((current) => ({
                                    ...current,
                                    teamName: e.target.value,
                                  }));
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-arcade-pink text-[10px] mt-1 font-mono" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teamSize"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1 space-y-0">
                            <PixelLabel>Team Size</PixelLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setRegistrationState((current) => ({
                                  ...current,
                                  teamSize: value,
                                }));
                              }}
                              value={registrationState.teamSize}
                              disabled={isTeamSizeLocked}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-black border-2 border-zinc-700 rounded-none focus:ring-0 focus:border-arcade-pink text-white h-12 font-mono text-sm">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-zinc-950 border-2 border-zinc-700 rounded-none font-mono text-white">
                                {teamSizeOptions.map(({ value, label }) => (
                                  <SelectItem
                                    key={value}
                                    value={value}
                                    className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-none text-sm"
                                  >
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {isTeamSizeLocked && (
                              <p className="text-[10px] text-arcade-cyan font-mono mt-1 uppercase tracking-wide">
                                Brain and Buzzers requires a compulsory team of 2.
                              </p>
                            )}
                            <FormMessage className="text-arcade-pink text-[10px] mt-1 font-mono" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Event preview */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 border-2 border-zinc-800 p-5 mt-6 bg-[#050505]">
                      <div className="shrink-0 border-2 border-arcade-pink shadow-[4px_4px_0px_#00FFFF]">
                        <img
                          src={selectedEvent.image}
                          alt={selectedEvent.name}
                          className="w-40 h-40 sm:w-48 sm:h-48 object-cover block"
                        />
                      </div>
                      <div className="flex flex-col justify-center text-center sm:text-left flex-1 py-2">
                        <p className="font-arcade text-[10px] sm:text-xs tracking-widest mb-3 text-zinc-400">
                          <span className="text-arcade-cyan mr-2">
                            &gt;&gt;
                          </span>
                          REGISTERING FOR
                        </p>
                        <p
                          className="font-arcade text-2xl sm:text-3xl text-white uppercase leading-tight"
                          style={{ textShadow: "4px 4px 0px #FF2D78" }}
                        >
                          {registrationState.eventName}
                        </p>
                      </div>
                    </div>
                  </ArcadeCard>
                )}

                {/* STEP 1 — Players */}
                {step === 1 && (
                  <div className="space-y-5">
                    {members.map((member, i) => (
                      <ArcadeCard
                        key={i}
                        title={
                          i === 0 ? `P1 — Team Lead` : `P${i + 1} — Member`
                        }
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                          {[
                            {
                              field: "full_name",
                              label: "Full Name",
                              placeholder: "Full Name",
                            },
                            {
                              field: "rollNumber",
                              label: "Roll Number",
                              placeholder: "e.g. 1604-XX-XXX-XXX",
                            },
                            {
                              field: "phone",
                              label: "Phone",
                              placeholder: "9876543210",
                            },
                            {
                              field: "email",
                              label: "Email",
                              placeholder: "player@mail.com",
                            },
                          ].map(({ field, label, placeholder }) => (
                            <div key={`${field}-${i}`} className="flex flex-col gap-1 space-y-0">
                              <PixelLabel>{label}</PixelLabel>
                              <PixelInput
                                placeholder={placeholder}
                                value={member[field]}
                                onChange={(e) => updateMember(i, field as any, e.target.value)}
                              />
                            </div>
                          ))}
                          <div className="flex flex-col gap-1 space-y-0 sm:col-span-2">
                            <PixelLabel>College / University</PixelLabel>
                            <PixelInput
                              placeholder="College Name"
                              value={member.college}
                              onChange={(e) => updateMember(i, "college", e.target.value)}
                            />
                          </div>
                        </div>
                      </ArcadeCard>
                    ))}
                  </div>
                )}

                {/* STEP 2 — Payment */}
                {step === 2 && (
                  <ArcadeCard title="03 — Payment">
                    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start p-2">
                      {/* Left: Mega QR Code */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white p-3 border-2 border-arcade-pink shadow-[2px_2px_0px_#00FFFF] transition-transform hover:scale-[1.02]">
                          <img
                            src={paymentImg}
                            alt="Payment details"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="font-mono text-xs sm:text-sm font-bold text-arcade-yellow tracking-widest text-center mt-2 p-2 border-2 border-zinc-800 bg-[#050505] w-full">
                          @sbi12345569
                        </p>
                      </div>

                      {/* Right: Instructions & Upload */}
                      <div className="flex-1 flex flex-col justify-between w-full h-full space-y-6">
                        <div className="border-l-2 border-zinc-800 pl-6 space-y-2 flex-1 pt-2">
                          <p className="font-mono text-xs text-zinc-500 tracking-widest font-bold">
                            INSTRUCTIONS
                          </p>
                          <ol className="space-y-3 mt-4">
                            {[
                              "Open any UPI app (GPay, PhonePe, Paytm)",
                              "Scan the QR code",
                              "Complete the required payment",
                              "Take a screenshot of the CONFIRMATION screen",
                            ].map((s, i) => (
                              <li
                                key={i}
                                className="flex gap-3 text-sm text-zinc-300 font-medium items-start"
                              >
                                <span className="text-arcade-pink font-bold mt-0.5">
                                  &gt;
                                </span>
                                {s}
                              </li>
                            ))}
                          </ol>
                        </div>

                        <FormField
                          control={form.control}
                          name="paymentScreenshot"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2 space-y-0 bg-[#050505] border-2 border-zinc-800 p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 bg-arcade-cyan"></span>
                                <PixelLabel>
                                  UPLOAD CONFIRMATION SCREENSHOT
                                </PixelLabel>
                              </div>
                              <FormControl>
                                <div className="relative group">
                                  <div className="absolute inset-0 bg-arcade-cyan translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <Input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                    onChange={(e) =>
                                      handlePaymentScreenshotChange(e.target.files, field.onChange)
                                    }
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    className="relative flex items-center justify-start w-full bg-black border-2 border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-arcade-cyan text-zinc-400 h-12 text-sm file:absolute file:inset-y-0 file:left-0 file:h-full file:mr-0 file:px-5 file:border-0 file:border-r-2 file:border-zinc-700 file:bg-zinc-800 file:text-white file:font-mono file:font-bold file:text-xs file:tracking-widest file:uppercase hover:file:bg-zinc-700 hover:file:text-arcade-cyan file:transition-colors cursor-pointer file:cursor-pointer p-0 pl-[125px] sm:pl-[140px] pt-3"
                                  />
                                </div>
                              </FormControl>
                              {paymentPreviewUrl && (
                                <div className="border-2 border-zinc-800 bg-black p-3 space-y-3">
                                  <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                                    Preview
                                  </p>
                                  <img
                                    src={paymentPreviewUrl}
                                    alt="Payment screenshot preview"
                                    className="w-32 h-32 object-cover border-2 border-arcade-pink shadow-[2px_2px_0px_#00FFFF]"
                                  />
                                </div>
                              )}
                              {paymentUploadMessage && (
                                <p
                                  className={`text-xs font-mono font-bold ${
                                    paymentUploadState === "success"
                                      ? "text-green-400"
                                      : paymentUploadState === "error"
                                      ? "text-arcade-pink"
                                      : "text-arcade-cyan"
                                  }`}
                                >
                                  {paymentUploadMessage}
                                </p>
                              )}
                              {paymentScreenshotPath && (
                                <p className="text-[10px] text-zinc-500 font-mono break-all">
                                  Stored path: {paymentScreenshotPath}
                                </p>
                              )}
                              <FormMessage className="text-arcade-pink text-xs mt-1 font-mono font-bold" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </ArcadeCard>
                )}

                {/* STEP 3 — Confirm */}
                {step === 3 && (
                  <ArcadeCard title="04 — Confirm & Transmit">
                    {registrationComplete ? (
                      <div className="space-y-5 text-center">
                        <div className="border-2 border-green-500 bg-black px-6 py-8 shadow-[3px_3px_0px_#00FFFF]">
                          <p className="font-arcade text-xl sm:text-2xl text-green-400 uppercase">
                            Registration Confirmed
                          </p>
                          <p className="mt-4 font-mono text-sm text-zinc-300 uppercase tracking-widest">
                            {registrationState.teamName}
                          </p>
                          <p className="mt-2 font-mono text-xs text-arcade-yellow uppercase tracking-widest">
                            for {registrationState.eventName}
                          </p>
                        </div>
                        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                          Your registration has been saved successfully.
                        </p>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="yellow"
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto"
                          >
                            RETURN HOME
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Summary rows */}
                        <div className="border-2 border-zinc-800 divide-y-2 divide-zinc-800">
                          {[
                            { label: "Event", value: registrationState.eventName },
                            { label: "Team", value: registrationState.teamName },
                            {
                              label: "Size",
                              value: `${teamSize} player${teamSize > 1 ? "s" : ""}`,
                            },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className="flex justify-between items-center px-4 py-2.5"
                            >
                              <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
                                {label}
                              </span>
                              <span className="font-mono text-xs text-white uppercase">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Member list */}
                        <div className="border-2 border-zinc-800 divide-y-2 divide-zinc-800">
                          {members.map((m, i) => (
                            <div
                              key={i}
                              className="px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden"
                            >
                              <span className="font-mono text-xs text-arcade-pink tracking-widest shrink-0">
                                P{i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-mono text-xs sm:text-[9px] text-white truncate">
                                  {m.full_name || "—"}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-zinc-500 truncate">
                                  {m.college || "—"}
                                </p>
                              </div>
                              <span className="font-mono text-[10px] sm:text-[8px] text-zinc-600 shrink-0 max-w-[80px] sm:max-w-none text-right truncate overflow-hidden">
                                {m.rollNumber || "—"}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Payment status */}
                        <div className="flex items-center gap-3 border-2 border-zinc-800 px-4 py-3">
                          <div
                            className={`w-2 h-2 shrink-0 ${paymentUploadState === "success" ? "bg-green-400" : "bg-zinc-700"}`}
                          />
                          <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                            {paymentUploadState === "success"
                              ? "Payment screenshot uploaded"
                              : "No successful screenshot upload yet"}
                          </span>
                        </div>
                      </div>
                    )}
                  </ArcadeCard>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {!registrationComplete && (
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 gap-4">
                <Button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0 || isSubmittingRegistration}
                  variant="outline"
                  className="w-full sm:w-auto flex-1 sm:flex-none"
                >
                  <ArrowLeft size={13} className="mr-2 hidden sm:block" /> BACK
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    variant="default"
                    className="w-full sm:w-auto flex-1 sm:flex-none text-black"
                  >
                    NEXT <ArrowRight size={13} className="ml-2 hidden sm:block" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="yellow"
                    disabled={isSubmittingRegistration}
                    className="w-full sm:w-auto flex-1 sm:flex-none"
                  >
                    {isSubmittingRegistration ? "TRANSMITTING..." : "TRANSMIT"}
                    <Check size={13} className="ml-2 hidden sm:block" />
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Registration;
