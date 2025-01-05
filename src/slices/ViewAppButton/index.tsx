import Button from "@/app/components/Button";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ViewAppButton`.
 */
export type ViewAppButtonProps =
  SliceComponentProps<Content.ViewAppButtonSlice>;

/**
 * Component for "ViewAppButton" Slices.
 */
const ViewAppButton = ({ slice }: ViewAppButtonProps): JSX.Element => {
  return (
    <Button
      linkField={slice.primary.button_link}
      label={slice.primary.button_text}
    />
  );
};

export default ViewAppButton;
