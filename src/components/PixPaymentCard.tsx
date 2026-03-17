"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createStaticPix, hasError } from "pix-utils";
import { Copy, Check } from "lucide-react";

interface PixPaymentCardProps {
  pixKey: string;
  amount: number;
  eventTitle: string;
  pixDescription?: string | null;
  paymentNote?: string | null;
}

export default function PixPaymentCard({
  pixKey,
  amount,
  eventTitle,
  pixDescription,
  paymentNote,
}: PixPaymentCardProps) {
  const [copied, setCopied] = useState(false);

  const brCode = useMemo(() => {
    const pix = createStaticPix({
      merchantName: "ICM",
      merchantCity: "BRASIL",
      pixKey,
      transactionAmount: amount,
      infoAdicional: (pixDescription ?? eventTitle).slice(0, 72),
      txid: "***",
    });
    if (hasError(pix)) return "";
    return pix.toBRCode();
  }, [pixKey, amount, pixDescription, eventTitle]);

  async function handleCopy() {
    await navigator.clipboard.writeText(brCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-4">
      <p className="text-sm text-gray-200 text-center">
        Escaneie o QR Code abaixo
      </p>

      <div className="bg-white p-3 rounded-lg">
        <QRCodeSVG value={brCode} size={220} />
      </div>

      {/* Valor a pagar */}
      <div className="text-center">
        <p className="text-sm text-gray-300">
          Valor a pagar:{" "}
          <span className="font-semibold">
            R$ {amount.toFixed(2).replace(".", ",")}
          </span>
        </p>
      </div>

      {/* Copia e cola */}
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs text-gray-400 text-center">Ou use o código copia e cola:</p>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2">
          <p className="flex-1 truncate text-xs text-white/80 font-mono">
            {brCode}
          </p>
          <button
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {paymentNote && (
        <p className="mt-1 text-xs text-gray-400 whitespace-pre-line text-center">
          {paymentNote}
        </p>
      )}

      <div className="mx-auto max-w-sm rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100 text-center">
        <span className="font-semibold block">
          Na descrição do pagamento/PIX coloque: &quot;{eventTitle}&quot;
        </span>
      </div>
    </div>
  );
}
