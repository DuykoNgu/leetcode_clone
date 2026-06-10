import { ComingSoon } from "@/components/ui/coming-soon"

export default function NotFound() {
  return (
    <ComingSoon
      postcardImage="/postcard.jpg"
      postcardAlt="New York City Skyline"
      curvedTextTop="The General Intelligence"
      curvedTextBottom="Company of New York"
      heading="Dang phat trien"
      subtext="Em đi để lại chơi vơi — Còn đây một trang web bơ vơ giữa đời."
      backButtonLabel="Quay lại trang chủ"
      backButtonHref="/"
    />
  )
}
