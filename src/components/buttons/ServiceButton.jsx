import { IoLogoAppleAr } from "react-icons/io5";
import { useModalManager } from "../../contexts/ModalManagerContext";
import ServiceList from "../common/ServiceList";


export default function ServiceButton() {
const { showModal } = useModalManager();



  return (
        <button
  onClick={() => showModal(<ServiceList />)}
      className="flex items-center justify-center text-xl sm:text-2xl p-2 md:px-4 md:py-2 rounded-xl border border-gray-500 transition bg-[#324154] text-white hover:bg-[#007bff]"
    >
      <span className='text-base px-1 hidden md:block'>
        سرویس ها
      </span>
      <IoLogoAppleAr />
    </button>
  )
}
