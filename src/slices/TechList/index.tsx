"use client"

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MdCircle } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

/**
 * Props for `TechList`.
 */
export type TechListProps = SliceComponentProps<Content.TechListSlice>;

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ slice }: TechListProps): JSX.Element => {
  const component = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 3,
        }
      });

      timeline.fromTo(
        ".tech-row",
        {
          x: (index) => {
            return index % 2 === 0 ? gsap.utils.random(650, 400) : gsap.utils.random(-650, -400)
          }
        },
        {
          x: (index) => {
            return index % 2 === 0 ? gsap.utils.random(-650, -400) : gsap.utils.random(650, 400)
          },
          ease: "power1.inOut"
        }
      )

    }, component)
    return () => ctx.revert() //Cleanup
  })

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <Bounded as="div">
        <Heading size="lg" className="mb-8" as="h2">
          {slice.primary.heading}
        </Heading>
      </Bounded>
      {slice.primary.tech_details.map((item) => (
        <div
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={item.tech_name || undefined}
        >
          {Array.from({ length: 15 }, (_, index) => (
            <React.Fragment key={index}>
              <span
                className="tech-item text-7xl font-extrabold uppercase tracking-tighter"
                style={{
                  color: index === 7 && item.tech_color ? item.tech_color : "inherit",
                }}
              >
                {item.tech_name}
              </span>
              <span className="text-2xl">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;
