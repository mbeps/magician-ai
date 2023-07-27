import Image from "next/image";

interface EmptyProps {
  label: string;
}

/**
 * Empty component which is displayed when there is no data to be displayed.
 * @param {label} (string): label to be displayed
 * @returns (JSX.Element): empty component
 */
export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image src="/empty.png" fill alt="Empty" />
      </div>
      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};
