// CustomerClubButton.jsx
import { FaUsers } from "react-icons/fa";
import { useModalManager } from "../../contexts/ModalManagerContext";
import CustomerClubFormModal from "../Modal/CustomerClubFormModal";

const  CustomerClubButton = ({ style }) => {
  const { showModal } = useModalManager();

  const openModal = () => {
    showModal(<CustomerClubFormModal />);
  };

  return (
    <button
className=" flex justify-between w-full items-center bg-[#008AFF] shadow-[0_0_20px_#008AFF] backdrop-blur-md border border-gray-300 rounded-xl p-4 text-xl text-white self-start"
      onClick={openModal}
    >
        <p className="hidden sm:block">

      باشگاه مشتریان
        </p>
      <FaUsers className="pl-1"/> 
    </button>
  );
};

export default CustomerClubButton;
