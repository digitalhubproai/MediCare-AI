import Link from "next/link";
import { Stethoscope } from "lucide-react";

interface LogoProps {
    className?: string;
    iconContainerClassName?: string;
    iconClassName?: string;
    textClassName?: string;
    aiClassName?: string;
}

export default function Logo({
    className = "",
    iconContainerClassName = "w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25",
    iconClassName = "w-5 h-5 text-white",
    textClassName = "text-xl text-slate-900",
    aiClassName = "text-blue-600"
}: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            <div className={`rounded-xl flex items-center justify-center shrink-0 ${iconContainerClassName}`}>
                <Stethoscope className={`shrink-0 ${iconClassName}`} />
            </div>
            <span className={`font-bold ${textClassName}`}>
                MediCare<span className={aiClassName}>AI</span>
            </span>
        </Link>
    );
}
