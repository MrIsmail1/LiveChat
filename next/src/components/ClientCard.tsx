import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ClientCardProps = {
  title: string
  description: string
  href?: string
  className?: string
}

export default function ClientCard({ title, description, href, className }: ClientCardProps) {
  const Wrapper = href ? "a" : "div"

  return (
    <Wrapper
      href={href}
      className={cn(
        "flex items-center justify-between border rounded-lg p-4 hover:shadow transition cursor-pointer",
        className
      )}
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground" />
    </Wrapper>
  )
}
