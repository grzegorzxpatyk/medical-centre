import { buttonVariants } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import Link, { LinkProps } from 'next/link'

export type LinkButtonProps = {
    href: LinkProps['href'];
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
    className?: string;
    children: string;
}

export function LinkButton({ href, variant, size, className, children }: LinkButtonProps) {
    return (
        <Link
            href={href}
            className={cn(buttonVariants({ variant, size }), className)}
        >
            {children}
        </Link>
    )
}
