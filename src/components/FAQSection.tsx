import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, Plus, HelpCircle, HelpingHand, MapPin } from "lucide-react";

// Reusable: split text into chars for stagger animation
const SplitText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.032, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const faqs = [
  {
    q: "Who can participate in Adsophos 2026?",
    a: "Adsophos 2026 is open to students from all colleges and departments. Participants can join individual or team-based events depending on the event rules."
  },
  {
    q: "How do I register for events?",
    a: "You can register through the official Adsophos website by selecting your desired events and completing the registration form. Confirmation details will be shared after successful registration."
  },
  {
    q: "Can I participate in more than one event?",
    a: "Yes. Participants are allowed to register for multiple events as long as the event timings do not overlap."
  },
  {
    q: "Will certificates be provided?",
    a: "Yes. All registered participants will receive participation certificates, and winners will receive merit certificates along with cash prizes."
  },
  {
    q: "What types of events will be conducted?",
    a: "Adsophos 2026 will include a variety of technical and fun activities which you can see in the events section and register from there."
  },
  {
    q: "Are there any fees to participate?",
    a: "Some events may require a registration fee, while others may be free. Fee details will be mentioned along with the event information."
  },
  {
    q: "Where will Adsophos 2026 be conducted?",
    a: (
      <div className="flex flex-col gap-2">
        <span>Adsophos 2026 will be conducted at:</span>
        <div className="flex flex-col gap-2 ml-1 my-1">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-arcade-yellow shrink-0" />
            <span className="text-zinc-300">Muffakham Jah College of Engineering and Technology, Hyderabad</span>
          </span>
        </div>
        <span>The exact venue details will also be available on the website.</span>
      </div>
    )
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 px-4 scroll-mt-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center mb-16 px-4">
          <div className="overflow-hidden mb-1 flex items-center justify-center gap-4">
            <HelpCircle className="text-arcade-pink w-10 h-10 md:w-14 md:h-14 mb-1" />
            <h2
              className="font-arcade text-4xl md:text-6xl text-center text-white"
              style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="QUEST" delay={0.1} />
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              className="font-arcade text-4xl mt-2 md:text-6xl text-center text-arcade-yellow"
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="LOG" delay={0.3} />
            </h2>
          </div>
          <p className="text-center text-arcade-cyan mt-6 font-arcade text-[10px] sm:text-xs uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}>
            FREQUENTLY ASKED QUESTIONS
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-zinc-950 border-4 group transition-all duration-300 relative hover:-translate-y-1 hover:-translate-x-1"
              style={{
                borderColor: `hsl(var(--arcade-pink))`,
                boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
              }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: .2, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none min-h-[80px]"
              >
                <div className="flex items-start gap-4">
                   <span className="font-arcade text-xs text-arcade-cyan pt-0">{i + 1}. </span>
                   <span className="font-arcade text-xs text-arcade-yellow group-hover:text-arcade-cyan transition-colors leading-tight">
                    {faq.q}
                   </span>
                </div>
                <div className={`transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}>
                   <ChevronDown className="text-arcade-pink" />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-2 ml-11 border-t-2 border-arcade-pink/30">
                       <div className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {faq.a}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="pixel-divider-yellow mt-20" />
    </section>
  );
};

export default FAQSection;
