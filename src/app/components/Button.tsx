import { KeyTextField, LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { MdArrowForward } from "react-icons/md";
import clsx from "clsx";

type ButtonProps = {
  linkField: LinkField,
  label: KeyTextField,
  showIcon?: boolean,
  className?: string,
  onClick?: () => void
}

export default function Button({ linkField, label, showIcon = true, className, onClick }: ButtonProps) {
  return (
    <PrismicNextLink field={linkField} className={clsx(
      "group relative flex w-fit items-center justify-center overflow-hidden rounded-md border-2 text-slate-800 border-slate-900 bg-slate-50  px-4 py-2 font-bold transition-transform ease-out no-underline hover:scale-105",
      className,
    )} onClick={onClick}>
      <span className={clsx(
        "absolute inset-0 z-0 h-full translate-x-[-100%] bg-cyan-500 transition-transform  duration-300 ease-in-out group-hover:translate-x-0",
      )}></span>
      <span className="relative flex items-center justify-center gap-2">
        {label} {showIcon && <MdArrowForward className="inline-block" />}
      </span>
    </PrismicNextLink>
  )
}