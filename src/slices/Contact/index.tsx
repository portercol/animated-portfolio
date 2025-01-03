import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { MdOutlineMail, MdOutlinePhone } from "react-icons/md";
import ContactForm from "@/app/components/ContactForm";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Contact`.
 */
export type ContactProps = SliceComponentProps<Content.ContactSlice>;

/**
 * Component for "Contact" Slices.
 */
const Contact = ({ slice }: ContactProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid gap-x-8 gap-y-4 mt-8 grid-cols-1 md:grid-cols-[3fr_2fr]">
        <div>
          <Heading as="h2" size="lg">
            {slice.primary.heading}
          </Heading>
          <div className="prose prose-lg prose-invert mt-4 max-w-lg">
            <PrismicRichText field={slice.primary.description} />
          </div>
          <div className="flex flex-col mt-8">
            <div className="flex items-center gap-4 prose prose-lg prose-invert">
              <MdOutlineMail />
              {slice.primary.email}
            </div>
            <div className="flex items-center gap-4 prose prose-lg prose-invert">
              <MdOutlinePhone />
              {slice.primary.phone_number}
            </div>
          </div>
        </div>
        <div className="flex mt-6 justify-center">
          <ContactForm className="max-w-sm w-full" />
        </div>
      </div>
    </Bounded>
  );
};

export default Contact;
