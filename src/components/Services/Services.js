import Image from "next/image";

const Services = ({ service, handleServiceClick }) => {
  return (
    <div
      key={service.id}
      className="w-full bg-naturalColor-2 h-[150px] rounded-md flex flex-col gap-y-[10px] items-center justify-center"
      onClick={() => handleServiceClick(service.id)}
    >
      <div className="bg-neutralColor-5 w-[80px] h-[80px] flex items-center justify-center rounded-lg">
        <Image src={service.image} width={50} height={50} alt={service.title} />
      </div>
      <span className="text-[12px] md:text-[14px]">{service.title}</span>
    </div>
  );
};

export default Services;
