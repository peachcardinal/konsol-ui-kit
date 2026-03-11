import React from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Typography } from "./Typography";
import { cn } from "../lib/utils";

import alfaImg from "../assets/images/alfa.png";
import docImg from "../assets/images/doc.png";
import downloadImg from "../assets/images/download.png";
import headphonesImg from "../assets/images/headphones.png";
import magnifyingGlassImg from "../assets/images/magnifying-glass.png";
import mandarinImg from "../assets/images/mandarin.png";
import personImg from "../assets/images/person.png";
import phoneImg from "../assets/images/phone.png";
import plusImg from "../assets/images/plus.png";
import pocketImg from "../assets/images/pocket.png";
import tornPaperImg from "../assets/images/torn-paper.png";
import tbankImg from "../assets/images/tbank.png";

const MOBILE_BREAKPOINT = 768;

const imageSrcMap = {
  doc: docImg,
  download: downloadImg,
  headphones: headphonesImg,
  "magnifying-glass": magnifyingGlassImg,
  mandarin: mandarinImg,
  person: personImg,
  phone: phoneImg,
  plus: plusImg,
  pocket: pocketImg,
  "torn-paper": tornPaperImg,
  tbank: tbankImg,
  alfa: alfaImg,
};

const Banner = React.forwardRef(
  (
    {
      className,
      variant = "default",
      title,
      description,
      actions,
      image,
      onClose,
      color = "purple",
      ...props
    },
    ref
  ) => {
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

    const imgSrc = image && imageSrcMap[image] ? imageSrcMap[image] : null;

    if (variant === "inline") {
      return (
        <Card
          ref={ref}
          radius="4xl"
          padding="sm"
          className={cn(
            "relative flex-col items-start gap-3 md:flex-row",
            color === "purple" && "bg-banner-purple-bg",
            color === "green" && "bg-banner-green-bg",
            color === "gold" && "bg-banner-gold-bg",
            color === "red" && "bg-banner-red-bg",
            className
          )}
          {...props}
        >
          <div className="flex w-full items-start gap-3 md:justify-between">
            {image && imgSrc && (
              <div className="flex-shrink-0">
                <img
                  className="hidden md:block"
                  src={imgSrc}
                  alt="banner"
                  height={80}
                />
                <img
                  className="block md:hidden"
                  src={imgSrc}
                  alt="banner"
                  height={40}
                />
              </div>
            )}
            <div className="flex w-full flex-col items-start gap-3 md:flex-row md:justify-between md:gap-1">
              <div className="flex flex-1 flex-col gap-1">
                <Typography variant="p3" weight="medium">
                  {title}
                </Typography>
                {description}
              </div>
              <div className="flex items-center gap-2">{actions}</div>
            </div>
            {onClose && (
              <Button
                variant="text"
                size="sm"
                icon="CloseIcon"
                iconOnly
                onClick={onClose}
                className="z-10"
              />
            )}
          </div>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        radius="4xl"
        padding="sm"
        className={cn(
          "relative min-h-[212px] overflow-hidden md:h-auto md:min-h-[122px]",
          color === "purple" && "bg-banner-purple-bg",
          color === "green" && "bg-banner-green-bg",
          color === "gold" && "bg-banner-gold-bg",
          color === "red" && "bg-banner-red-bg",
          className
        )}
        {...props}
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center justify-between">
              <Typography
                variant="p3"
                weight="medium"
                className="w-[90%] md:max-w-[60%]"
              >
                {title}
              </Typography>
            </div>
            <div className="z-[11] w-[90%] md:max-w-[60%]">
              <Typography variant={isMobile ? "p1" : "p2"}>
                {description}
              </Typography>
            </div>
          </div>
          {actions && <div className="z-[11]">{actions}</div>}
        </div>

        {image && imgSrc && (
          <>
            <div
              className={cn(
                "absolute -bottom-[100px] -right-[100px] h-[190px] w-[336px] rotate-[-30deg] rounded-[250px] md:right-11 md:top-1/2 md:-translate-y-1/2",
                color === "purple" && "bg-banner-purple-fg",
                color === "green" && "bg-banner-green-fg",
                color === "gold" && "bg-banner-gold-fg",
                color === "red" && "bg-banner-red-fg"
              )}
            />
            <img
              className="absolute right-[120px] top-1/2 z-10 hidden -translate-y-1/2 md:block"
              src={imgSrc}
              alt="banner"
              height={180}
            />
            <img
              className="absolute -bottom-[50px] -right-[10px] z-10 md:hidden"
              src={imgSrc}
              alt="banner"
              height={180}
            />
          </>
        )}
        <div className="absolute right-4 top-4">
          {onClose && (
            <Button
              variant="text"
              size="sm"
              icon="CloseIcon"
              iconOnly
              onClick={onClose}
              className="z-10"
            />
          )}
        </div>
      </Card>
    );
  }
);
Banner.displayName = "Banner";

export { Banner };
