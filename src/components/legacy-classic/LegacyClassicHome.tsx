"use client";

/* eslint-disable @next/next/no-img-element -- the Legacy section intentionally preserves the original site's plain image rendering. */

import { motion } from "framer-motion";
import styles from "./LegacyClassic.module.scss";

const workExperience = [
  {
    place: "IM30 / Tap4fun, Beijing, China",
    tenure: "JUL 2019 - Oct 2022",
    role: "Senior Game Designer",
    detail:
      "Contributed to a top 50 global gaming revenue company ($760 million annually), where I helped design level gameplay as part of a game project generating over $20 million in monthly revenue.",
  },
  {
    place: "Gatech, Remote",
    tenure: "FAL 2023 - Present",
    role: "Student",
    detail:
      "Operating System, Software Development Process, Machine Learning for Trading, Video Game Design & Development",
  },
  {
    place: "Northeastern University, San Jose, CA",
    tenure: "FAL 2023 - Present",
    role: "Student / Research Assistant",
    detail:
      "Discrete Mathematics, Object-Oriented Programming, Data Structures & Algorithms, Algorithms",
  },
] as const;

const fade = (x: number, y: number, delay: number) => ({
  initial: { opacity: 0, x, y },
  whileInView: { opacity: 1, x: 0, y: 0 },
  viewport: { once: false, amount: 0.25 },
  transition: { type: "tween" as const, delay, duration: 1, ease: "easeOut" },
});

export function LegacyClassicHome() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.upperElements}>
            <motion.span {...fade(-100, 0, 0.2)} className={styles.primaryText}>
              Hey There, <br />I&apos;m Levon.
            </motion.span>
            <motion.span {...fade(100, 0, 0.2)} className={styles.secondaryText}>
              I focus on <br />AI and Game Devlopment.
            </motion.span>
          </div>

          <motion.a
            {...fade(-100, 0, 0.2)}
            className={styles.email}
            href="mailto:zhao.levon@gmail.com"
          >
            zhao.levon@gmail.com
          </motion.a>

          <motion.div {...fade(0, 100, 0.3)} className={styles.person}>
            <motion.img
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "tween", delay: 0.4, duration: 1.2, ease: "easeOut" }}
              src="/legacy-original/person.png"
              alt=""
            />
          </motion.div>

          <div className={styles.lowerElements}>
            <motion.div {...fade(-100, 0, 0.2)} className={styles.experience}>
              <span className={styles.experienceNumber}>3 Years</span>
              <span className={styles.experienceLabel}>Game Designer</span>
              <span className={styles.experienceNumber}>1 Year</span>
              <span className={styles.experienceLabel}> Data  Anaylst </span>
            </motion.div>
            <motion.div {...fade(100, 0, 0.2)} className={styles.certificate}>
              <img src="/legacy-original/certificate.png" alt="" />
              <span>Certified AWS Cloud Practitioner</span>
              <span>Passed CFA Level 1 Test</span>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.5 } },
        }}
        className={styles.timeline}
      >
        <div className={styles.timelineInner}>
          <span className={styles.timelineTitle}>My Work Experience</span>
          <div className={styles.experiences}>
            {workExperience.map((experience) => (
              <motion.article
                key={experience.place}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "tween", ease: "easeIn" },
                  },
                }}
                className={styles.timelineRow}
              >
                <div>
                  <h2>{experience.place}</h2>
                  <p>{experience.tenure}</p>
                </div>
                <div className={styles.role}>
                  <h2>{experience.role}</h2>
                  <p>{experience.detail}</p>
                </div>
              </motion.article>
            ))}

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ type: "tween", delay: 1, duration: 1, ease: "easeOut" }}
              className={styles.progressbar}
              aria-hidden="true"
            >
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ type: "tween", delay: 2, duration: 1.5, ease: "easeOut" }}
                className={styles.progressLine}
              />
              {[
                "#286F6C",
                "#F2704E",
                "#EEC048",
              ].map((color) => (
                <div key={color}>
                  <div className={styles.circle} style={{ background: color }} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
