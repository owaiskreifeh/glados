import { ReactNode } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../ui/card";
import Link from "next/link";

export interface ServiceCardProps {
  title: string;
  description: string;
  link: string;
  children?: ReactNode;
}
export function ServiceCard({
  title,
  description,
  link,
  children,
}: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      <CardFooter>
        <Link href={link}>Use</Link>
      </CardFooter>
    </Card>
  );
}
