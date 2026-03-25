import { motion } from "framer-motion";
import { Clock, Trophy, GraduationCap, Presentation, Mic2, Gamepad2, Sparkles, MapPin } from "lucide-react";

const allEvents = [
  {
    day: "DAY 1",
    date: "9th April",
    items: [
      { time: "9:00 AM", title: "Opening Ceremony", desc: "Welcome & Keynote", icon: Mic2, color: "arcade-pink" },
      { time: "10:30 AM", title: "Paper Presentation", desc: "Technical research & innovation showcase", icon: Presentation, color: "arcade-yellow" },
      { time: "12:00 PM", title: "Poster Presentation", desc: "Visual storytelling & data visualization", icon: GraduationCap, color: "arcade-cyan" },
      { time: "2:00 PM", title: "Quiz Competition — Round 1", desc: "Preliminary eliminator rounds", icon: Trophy, color: "arcade-pink" },
      { time: "5:00 PM", title: "Fun Events Arena", desc: "Mini-games, treasure hunts & social quests", icon: Gamepad2, color: "arcade-yellow" },
    ]
  },
  {
    day: "DAY 2",
    date: "10th April",
    items: [
      { time: "9:00 AM", title: "Project Expo", desc: "Live demonstrations of hardware & software hacks", icon: Sparkles, color: "arcade-cyan" },
      { time: "11:00 AM", title: "Quiz Finale", desc: "The ultimate showdown for the championship", icon: Trophy, color: "arcade-pink" },
      { time: "1:00 PM", title: "Evaluation Phase", desc: "Final judging and expert reviews", icon: MapPin, color: "arcade-yellow" },
      { time: "3:00 PM", title: "Fun Events Finale", desc: "Meme contest & talent show results", icon: Gamepad2, color: "arcade-cyan" },
      { time: "5:30 PM", title: "Award Gala", desc: "Closing ceremony & prize distribution", icon: Sparkles, color: "arcade-pink" },
    ]
  }
];

const ScheduleSection = () => (
  <section id="schedule" className="relative py-24 px-4 scroll-mt-24 bg-background">
    <div className="pixel-divider-yellow mb-20" />

    <div className="container mx-auto max-w-5xl">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 
          className="font-display text-5xl md:text-7xl text-white mb-4 hero-title-glow"
          style={{
            WebkitTextStroke: '2px hsl(340, 100%, 57%)',
            paintOrder: 'stroke fill',
          }}
        >
          GAME TIMELINE
        </h2>
        <p className="font-body text-sm text-muted-foreground uppercase tracking-[0.4em]">
          The Quest Schedule for Adsophos 2026
        </p>
      </motion.div>

      <div className="relative">
        {/* The vertical core line */}
        <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-arcade-pink via-arcade-yellow to-arcade-cyan transform -translate-x-1/2 opacity-30 px-[1px]" />

        <div className="space-y-12">
          {allEvents.map((dayGroup) => (
            <div key={dayGroup.day} className="relative pt-10">
              {/* Day Heading */}
              <div className="relative z-10 flex justify-center mb-12">
                 <div className="px-8 py-2 bg-background border-2 border-arcade-yellow pixel-border-yellow font-arcade text-xs text-arcade-yellow shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                    {dayGroup.day} — {dayGroup.date}
                 </div>
              </div>

              <div className="space-y-12">
                {dayGroup.items.map((ev, i) => (
                  <motion.div
                    key={ev.title}
                    className={`relative flex flex-col md:flex-row items-start md:items-center ${
                      i % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                    initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    {/* The Dot */}
                    <div className="absolute left-[19px] md:left-1/2 top-6 md:top-1/2 w-4 h-4 bg-background border-4 border-arcade-pink rounded-none transform -translate-x-1/2 -ms-[2px] z-10 box-content shadow-[0_0_10px_hsl(var(--arcade-pink))]" />

                    {/* Content Box */}
                    <div className={`w-full md:w-[45%] group pl-10 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 text-left"}`}>
                      <div className={`flex items-center gap-2 mb-3 font-arcade text-[9px] text-${ev.color} ${i % 2 === 0 ? "md:justify-end" : "justify-start"}`}>
                        <Clock size={12} className="opacity-70" />
                        <span>{ev.time}</span>
                      </div>
                      
                      <div className="bg-card p-6 pixel-border group-hover:scale-[1.03] transition-transform duration-400 relative">
                         {/* Side Accent Icon */}
                         <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-background border-2 border-arcade-pink items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 ${i % 2 === 0 ? "-right-5" : "-left-5 shadow-[0_0_15px_hsl(var(--arcade-pink))]"}`}>
                            <ev.icon size={18} className="text-arcade-pink" />
                         </div>

                        <h4 className="font-display text-xl text-foreground mb-2 group-hover:text-arcade-pink transition-colors">
                          {ev.title}
                        </h4>
                        <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
                          {ev.desc}
                        </p>
                      </div>
                    </div>
                    
                    {/* Spacer for horizontal layout */}
                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="pixel-divider mt-24" />
  </section>
);

export default ScheduleSection;
