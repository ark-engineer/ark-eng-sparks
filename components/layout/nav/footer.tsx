"use client";
import React from "react";
import Link from "next/link";
import { useLayout } from "../layout-context";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, MapsSquare01Icon, WhatsappIcon } from "@hugeicons/core-free-icons";

export const Footer = () => {
  const { globalSettings } = useLayout();

  const footerIcons = {
    insta: "",
    wpp: "",
    location: ""
  };

  return (
    <footer className="flex justify-between rounded-3xl bg-black h-[83px] w-[95%] mx-auto my-3 text-white text-base flex-wrap">
      <div className="grid place-items-center mx-5">
        <Image
          src='/uploads/project-logos/AE.svg'
          width={38}
          height={38}
          alt="icone" />
      </div>
      <div className="flex flex-col justify-end p-[20px]">
        <div className="flex flex-row gap-4">
          <Link href="/" aria-label="go home">
            <HugeiconsIcon name="instagram" icon={InstagramIcon} className="cursor-pointer" />
          </Link>
          <Link href="/" aria-label="go home">
            <HugeiconsIcon name="whatsapp" icon={WhatsappIcon} className="cursor-pointer" />
          </Link>

          <Link href="/" aria-label="go home">
            <HugeiconsIcon name="maps url" icon={MapsSquare01Icon} className="cursor-pointer" />
          </Link>

        </div>
        <div>
          <p>
            Copyright © {new Date().getFullYear()}. Todos os direitos reservados
          </p>
        </div>
        {/* <Link href="/" aria-label="go home">
          ola mundo
        </Link> */}
      </div>
    </footer>
  );
}
