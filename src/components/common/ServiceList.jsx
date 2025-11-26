import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { BsGem } from "react-icons/bs";
import { PiMapPinDuotone } from "react-icons/pi";

export default function ServiceList() {
  const { colors } = useContext(ThemeContext);

  const items = [
    {
      icon: <BsGem size={28} color={colors.pointStart} />,
      title: "Diamond",
      link: "https://diamondpl.com",
      description: null,
    },
    {
      icon: <PiMapPinDuotone size={28} color={colors.pointStart} />,
      title: "Lantern",
      link: "https://shivacorp.com/",
      description: null,
    },
    {
      icon: <img src="./images/cropped-Shiva-LOGO-web-1-scaled-1-32x32.webp" />,
      title: "shivacorp",
      link: "https://shivacorp.com/",
      description: null,
    },
  ];

  return (
    <div
      style={{
        background: colors.canvasBackground,
        color: colors.textSecondary,
      }}
      className="w-80 p-4 rounded-xl shadow-xl"
    >
      <h2
        style={{ color: colors.textSecondary }}
        className="text-lg font-bold mb-4"
      >
        سرویس‌ها
      </h2>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: colors.background,
              borderColor: colors.textMuted,
              color: colors.textSecondary,
            }}
            className="
              flex items-center gap-3 p-3 border rounded-xl 
              hover:opacity-90 transition cursor-pointer
            "
          >
            <div className="text-2xl">
              {item.icon}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold" style={{ color:colors.textSecondary}}>
                {item.title}
              </span>

              {item.description && (
                <span
                  style={{ color: colors.textMuted }}
                  className="text-sm"
                >
                  {item.description}
                </span>
              )}
            </div>
          </a>
        ))}
      </ul>
    </div>
  );
}
