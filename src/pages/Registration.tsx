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

const memberSchema = z.object({
  name: z.string().min(2, "Required"),
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
  const eventName = searchParams.get("event") || "";
  const selectedEvent =
    eventCards.find((e) => e.name === eventName) || eventCards[0];

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
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
      teamName: "",
      teamSize: "1",
      members: [{ name: "", phone: "", rollNumber: "", email: "", college: "" }],
      paymentScreenshot: undefined,
    },
  });

  const teamSize = parseInt(form.watch("teamSize"), 10) || 1;
  const currentMembers = form.watch("members");
  const allValues = form.watch();

  useEffect(() => {
    if (selectedEvent.registrationUrl) {
      window.location.assign(selectedEvent.registrationUrl);
    }
  }, [selectedEvent]);

  useEffect(() => {
    const forcedTeamSize = teamSizeOptions[0]?.value;
    if (forcedTeamSize && !teamSizeOptions.some((option) => option.value === form.getValues("teamSize"))) {
      form.setValue("teamSize", forcedTeamSize, { shouldValidate: true });
    }
  }, [selectedEvent.name]);

  useEffect(() => {
    const currentLen = currentMembers.length;
    if (teamSize > currentLen) {
      const newMembers = [...currentMembers];
      for (let i = currentLen; i < teamSize; i++)
        newMembers.push({ name: "", phone: "", rollNumber: "", email: "", college: "" });
      form.setValue("members", newMembers);
    } else if (teamSize < currentLen) {
      form.setValue("members", currentMembers.slice(0, teamSize));
    }
  }, [teamSize]);

  const goNext = async () => {
    let fields: any[] = [];
    if (step === 0) fields = ["teamName", "teamSize"];
    if (step === 1)
      fields = currentMembers.flatMap((_, i) => [
        `members.${i}.name`, `members.${i}.phone`,
        `members.${i}.rollNumber`, `members.${i}.email`, `members.${i}.college`,
      ]);
    if (step === 2) fields = ["paymentScreenshot"];

    const valid = await form.trigger(fields as any);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const onSubmit = (values: FormValues) => {
    toast.success("REGISTRATION COMPLETE!", {
      description: `${values.teamName} registered for ${selectedEvent.name}.`,
      className: "border-2 border-green-500 rounded-none bg-black text-green-400 font-mono",
    });
    setTimeout(() => navigate("/"), 2500);
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
                              onValueChange={field.onChange}
                              value={field.value}
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
                          {selectedEvent.name}
                        </p>
                      </div>
                    </div>
                  </ArcadeCard>
                )}

                {/* STEP 1 — Players */}
                {step === 1 && (
                  <div className="space-y-5">
                    {[...Array(teamSize)].map((_, i) => (
                      <ArcadeCard
                        key={i}
                        title={
                          i === 0 ? `P1 — Team Lead` : `P${i + 1} — Member`
                        }
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                          {[
                            {
                              name: `members.${i}.name`,
                              label: "Full Name",
                              placeholder: "Full Name",
                            },
                            {
                              name: `members.${i}.rollNumber`,
                              label: "Roll Number",
                              placeholder: "21XX1A05XX",
                            },
                            {
                              name: `members.${i}.phone`,
                              label: "Phone",
                              placeholder: "9876543210",
                            },
                            {
                              name: `members.${i}.email`,
                              label: "Email",
                              placeholder: "player@mail.com",
                            },
                          ].map(({ name, label, placeholder }) => (
                            <FormField
                              key={name}
                              control={form.control}
                              name={name as any}
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 space-y-0">
                                  <PixelLabel>{label}</PixelLabel>
                                  <FormControl>
                                    <PixelInput
                                      placeholder={placeholder}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-arcade-pink text-[10px] mt-1 font-mono" />
                                </FormItem>
                              )}
                            />
                          ))}
                          <FormField
                            control={form.control}
                            name={`members.${i}.college` as any}
                            render={({ field }) => (
                              <FormItem className="flex flex-col gap-1 space-y-0 sm:col-span-2">
                                <PixelLabel>College / University</PixelLabel>
                                <FormControl>
                                  <PixelInput
                                    placeholder="College Name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-arcade-pink text-[10px] mt-1 font-mono" />
                              </FormItem>
                            )}
                          />
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
                            src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=adsophos@upi&pn=Adsophos"
                            alt="UPI QR"
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
                                    accept="image/*"
                                    onChange={(e) =>
                                      field.onChange(e.target.files)
                                    }
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    className="relative flex items-center justify-start w-full bg-black border-2 border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-arcade-cyan text-zinc-400 h-12 text-sm file:absolute file:inset-y-0 file:left-0 file:h-full file:mr-0 file:px-5 file:border-0 file:border-r-2 file:border-zinc-700 file:bg-zinc-800 file:text-white file:font-mono file:font-bold file:text-xs file:tracking-widest file:uppercase hover:file:bg-zinc-700 hover:file:text-arcade-cyan file:transition-colors cursor-pointer file:cursor-pointer p-0 pl-[125px] sm:pl-[140px] pt-3"
                                  />
                                </div>
                              </FormControl>
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
                    <div className="space-y-4">
                      {/* Summary rows */}
                      <div className="border-2 border-zinc-800 divide-y-2 divide-zinc-800">
                        {[
                          { label: "Event", value: selectedEvent.name },
                          { label: "Team", value: allValues.teamName },
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
                        {allValues.members?.map((m, i) => (
                          <div
                            key={i}
                            className="px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden"
                          >
                            <span className="font-mono text-xs text-arcade-pink tracking-widest shrink-0">
                              P{i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-xs sm:text-[9px] text-white truncate">
                                {m.name || "—"}
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
                          className={`w-2 h-2 shrink-0 ${allValues.paymentScreenshot?.length ? "bg-green-400" : "bg-zinc-700"}`}
                        />
                        <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                          {allValues.paymentScreenshot?.length
                            ? "Payment screenshot attached"
                            : "No screenshot attached"}
                        </span>
                      </div>
                    </div>
                  </ArcadeCard>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 gap-4">
              <Button
                type="button"
                onClick={goBack}
                disabled={step === 0}
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
                  className="w-full sm:w-auto flex-1 sm:flex-none"
                >
                  TRANSMIT <Check size={13} className="ml-2 hidden sm:block" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Registration;
