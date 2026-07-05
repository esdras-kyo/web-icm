export type CsvValue = string | number | boolean | null | undefined;

interface DownloadCsvOptions {
  /** Nome do arquivo gerado (ex.: "membros-05-07-2026.csv"). */
  fileName: string;
  /** Cabeçalho das colunas. */
  header: string[];
  /** Linhas de dados, na mesma ordem do cabeçalho. */
  rows: CsvValue[][];
  /** Linhas de metadados exibidas antes do cabeçalho (ex.: data de exportação). */
  meta?: [string, CsvValue][];
}

/**
 * Gera e dispara o download de um CSV no navegador (Blob API).
 * Padrão pt-BR: separador ";" e BOM UTF-8 para compatibilidade com Excel.
 */
export function downloadCsv({ fileName, header, rows, meta }: DownloadCsvOptions): void {
  const escape = (field: CsvValue) =>
    `"${(field ?? "").toString().replace(/"/g, '""')}"`;

  const blocks: CsvValue[][] = [
    ...(meta ?? []),
    ...(meta && meta.length ? [[]] : []),
    header,
    ...rows,
  ];

  const csvString = blocks
    .map((row) => row.map(escape).join(";"))
    .join("\n");

  const blob = new Blob(["﻿" + csvString], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
