"use client";
import { Paragraph } from "@/components/Paragraph";
import Image from "next/image";

import { motion } from "framer-motion";

export default function About() {
  const images = [
    "/images/about.webp",
    "/images/levon-portrait.png",
    "/media/research/yolo-kan-poster.jpg",
    "/media/morphing/miku-midpoint.jpg",
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 my-10">
        {images.map((image, index) => (
          <motion.div
            key={image}
            initial={{
              opacity: 0,
              y: -50,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: index % 2 === 0 ? 3 : -3,
            }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Image
              src={image}
              width={200}
              height={400}
              alt={
                [
                  "Levon's workspace",
                  "Portrait of Levon Zhao",
                  "YOLO-KAN research poster",
                  "Beier-Neely morphing study",
                ][index]
              }
              className="rounded-md object-cover transform rotate-3 shadow-xl block w-full h-40 md:h-60 hover:rotate-0 transition duration-200"
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl">
        <Paragraph className=" mt-4">
          Hey there, I&apos;m Levon Zhao - a passionate game designer turned
          software engineer, with a deep interest in AI and machine learning.
          Welcome to my corner of the digital world!
        </Paragraph>
        <Paragraph className=" mt-4">
          With more than three years of experience as a game designer at IM30/Tap4fun,
          I led the development of large-scale gameplay features for &quot;Last
          War&quot; - a top revenue-generating strategy mobile game generating
          over $20 million in monthly revenue. My work increased player
          engagement by 67% and became standard in the strategy genre.
        </Paragraph>

        <Paragraph className=" mt-4">
          Currently, I&apos;m pursuing two Master&apos;s degrees simultaneously
          - one in Computer Science at Northeastern University and another at
          Georgia Institute of Technology, maintaining an &apos;A&apos; grade in
          all courses. I hold AWS Certified Machine Learning Specialty and Cloud
          Practitioner certifications.
        </Paragraph>
        <Paragraph className=" mt-4">
          My technical stack includes C/C++, Java, Python, TypeScript, React,
          Next.js, and various AWS services. I&apos;m particularly interested in
          the intersection of AI and gaming, exploring how machine learning can
          enhance game experiences and player engagement.
        </Paragraph>
        <Paragraph className=" mt-4">
          Fun fact: I&apos;m a certified professional Mahjong player in China
          and own a $4,000 automatic Mahjong table. I believe strategic games
          teach us valuable lessons about decision-making and probability that
          apply to both game design and software engineering.
        </Paragraph>
        <Paragraph className=" mt-4">
          Through this website, I share my projects, insights, and experiences
          in game development, machine learning, and full-stack engineering.
          Whether you&apos;re interested in AI, games, or software development,
          there&apos;s something here for you.
        </Paragraph>
        <Paragraph className=" mt-4">
          Thank you for visiting, and feel free to reach out if you&apos;d like
          to collaborate or chat!
        </Paragraph>
      </div>
    </div>
  );
}
