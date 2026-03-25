import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, HelpCircle } from "lucide-react";

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
    a: "Adsophos 2026 will be conducted at: \n\n📍 Muffakham Jah College of Engineering and Technology\n📍 Hyderabad\n\nThe exact venue details will also be available on the website."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 px-4 scroll-mt-24">
      <div className="container mx-auto max-w-3xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
             <HelpCircle className="text-arcade-yellow animate-pulse" />
             <h2 className="font-display text-4xl md:text-6xl text-arcade-pink hero-title-glow">
                QUEST LOG
             </h2>
          </div>
          <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">
            Frequently Asked Questions
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-card pixel-border group transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <div className="flex items-start gap-4">
                   <span className="font-arcade text-xs text-arcade-yellow pt-1">{i + 1}</span>
                   <span className="font-display text-lg md:text-xl text-foreground group-hover:text-arcade-pink transition-colors leading-tight">
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
                    <div className="p-6 pt-0 ml-11 border-t-2 border-arcade-pink/10 mt-2">
                       <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {faq.a}
                       </p>
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
