"use client";
import React from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { CiVideoOn, CiMicrophoneOn } from "react-icons/ci";
import { PiStudentLight } from "react-icons/pi";
import { CiChat2 } from "react-icons/ci";

const stats = [
  {
    icon: <PiStudentLight className="text-secondery sm:w-14 sm:h-14 w-10 h-10" />,
    end: 1000,
    label: "دانشجو",
  },
  {
    icon: <CiVideoOn className="text-secondery sm:w-14 sm:h-14 w-10 h-10" />,
    end: 10,
    label: "دوره",
  },
  {
    icon: <CiMicrophoneOn className="text-secondery sm:w-14 sm:h-14 w-10 h-10" />,
    end: 100,
    label: "پادکست",
  },
  {
    icon: <CiChat2 className="text-secondery sm:w-14 sm:h-14 w-10 h-10" />,
    end: 999,
    label: "نظر مثبت",
  },
];

const AboutUsStats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="w-full py-6 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="shadow-2xl rounded-3xl p-5 sm:p-6">
          <div
            ref={ref}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          >
            {stats.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                {item.icon}
                <span className="sm:text-2xl text-lg font-bold text-primary">
                  {inView && <CountUp end={item.end} duration={2} />}+
                </span>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsStats;
