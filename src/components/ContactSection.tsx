import React, { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, Instagram, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Button } from "./ui/button";

const EMAILJS_PUBLIC_KEY = "l9EHXIW9KoRrPRIkT";
const EMAILJS_TEMPLATE_ID = "template_yvrpzcu";
const EMAILJS_SERVICE_ID = "service_kf30xbx";

// Reusable: split text into chars for stagger animation
const SplitText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.032,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSending(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          from_name: formData.name,
          user_name: formData.name,
          email: formData.email,
          from_email: formData.email,
          reply_to: formData.email,
          user_email: formData.email,
          message: formData.message,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Could not send the message. Please try again.");
      console.error("EmailJS error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 px-4 scroll-mt-24">
      <div className="container mx-auto max-w-4xl px-3">
        <div className="flex flex-col items-center justify-center mb-6 mt-10">
          <div className="overflow-hidden mb-1">
            <h2
              className="font-arcade text-4xl md:text-6xl text-center text-white"
              style={{
                textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)",
              }}
            >
              <SplitText text="NEED" delay={0.1} />
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              className="font-arcade text-4xl mt-2 md:text-6xl text-center text-arcade-yellow"
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="HELP?" delay={0.3} />
            </h2>
          </div>
        </div>
        <p className="text-center text-arcade-cyan mb-14 font-arcade text-[10px] sm:text-xs uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}>
          Reach out to the ADSOPHOS support.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 px-2 pb-6">
          <motion.div
            className="bg-zinc-950 border-4 p-6 md:p-8 flex flex-col group"
            style={{
              borderColor: `hsl(var(--arcade-pink))`,
              boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="NAME"
                className="w-full px-4 py-4 bg-zinc-900/50 text-white font-body font-bold text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors placeholder:text-zinc-600"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL"
                className="w-full px-4 py-4 bg-zinc-900/50 text-white font-body font-bold text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors placeholder:text-zinc-600"
              />
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="YOUR MESSAGE..."
                className="w-full px-4 py-4 bg-zinc-900/50 text-white font-body font-bold text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors resize-none placeholder:text-zinc-600"
              />
              <Button
                type="submit"
                disabled={isSending}
                className="w-full font-body font-bold text-xs tracking-[0.1em] py-3 h-auto text-black disabled:opacity-70"
              >
                {isSending ? "SENDING..." : "SEND MESSAGE"}
                <Send className="ml-2" size={16} />
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center gap-6 md:gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
                style={{
                  borderColor: `hsl(var(--arcade-pink))`,
                  boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
                }}>
                <Mail className="w-5 h-5 text-arcade-yellow" />
              </div>
              <span className="font-body font-bold text-white text-sm md:text-base tracking-widest lowercase transition-colors group-hover:text-arcade-yellow">csi@mjcollege.ac.in</span>
            </div>
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
                style={{
                  borderColor: `hsl(var(--arcade-pink))`,
                  boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
                }}>
                <Phone className="w-5 h-5 text-arcade-yellow" />
              </div>
              <span className="font-body font-bold text-white text-sm md:text-base tracking-widest transition-colors group-hover:text-arcade-yellow">Abdullah: 7780227803</span>
            </div>
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
                style={{
                  borderColor: `hsl(var(--arcade-pink))`,
                  boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
                }}>
                <Phone className="w-5 h-5 text-arcade-yellow" />
              </div>
              <span className="font-body font-bold text-white text-sm md:text-base tracking-widest transition-colors group-hover:text-arcade-yellow">Touseeef: 9989598636</span>
            </div>

            <div className="flex gap-4 md:gap-6 mt-4">
              <a
                href="https://www.instagram.com/adsophos_cse?igsh=Ymt6cnF2eDBoeGho"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
                style={{
                  borderColor: `hsl(var(--arcade-pink))`,
                  boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
                }}
              >
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
