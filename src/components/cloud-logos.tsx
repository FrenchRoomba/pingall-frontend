import Image from "next/image";
import React from "react";

interface CloudLogoProps {
  provider: string;
  className?: string;
}

export function CloudLogo({
  provider,
  className = "h-4 w-auto mr-2",
}: CloudLogoProps) {
  // Extract the height from the className for the Image component
  const height = parseInt(className.match(/h-(\d+)/)?.[1] || "4") * 4; // Tailwind units are 4px each

  switch (provider.toLowerCase()) {
    case "aws":
      return (
        <Image
          src="/images/cloud-logos/aws-logo.svg"
          alt="AWS Logo"
          height={height}
          width={height * 1.5} // AWS logo is wider than tall
          className={className}
          style={{ objectFit: "contain" }}
        />
      );
    case "gcp":
      return (
        <Image
          src="/images/cloud-logos/gcp-logo.svg"
          alt="Google Cloud Logo"
          height={height}
          width={height * 1.6} // GCP logo is wider than tall
          className={className}
          style={{ objectFit: "contain" }}
        />
      );
    case "azure":
      return (
        <Image
          src="/images/cloud-logos/azure-logo.svg"
          alt="Azure Logo"
          height={height}
          width={height * 1.2} // Azure logo is slightly wider than tall
          className={className}
          style={{ objectFit: "contain" }}
        />
      );
    case "alicloud":
      return (
        <Image
          src="/images/cloud-logos/alibaba-logo.svg"
          alt="Alibaba Cloud Logo"
          height={height}
          width={height} // New SVG is square (1:1 aspect ratio)
          className={className}
          style={{ objectFit: "contain" }}
        />
      );
    default:
      // Fallback to a generic cloud icon for unknown providers
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4v7h7V4H4zm9 0v7h7V4h-7zm-9 9v7h7v-7H4zm9 0v7h7v-7h-7zm1-8h5v5h-5V5zM5 5h5v5H5V5zm1 10h5v5H6v-5zm9 0h5v5h-5v-5z" />
        </svg>
      );
  }
}
