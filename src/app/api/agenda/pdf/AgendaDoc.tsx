
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type AgendaRow = {
  title: string;
  description: string | null;
  event_date: string;    // YYYY-MM-DD
  event_time: string | null; // HH:mm:ss
};

function monthKey(dateISO: string) {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d);
}
function dayStr(dateISO: string) {
  const d = new Date(dateISO);
  const dia = d.toLocaleDateString("pt-BR", { day: "2-digit" });
  const dow = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  return `${dia} (${dow})`;
}
function timeStr(t?: string | null) {
  return t ? t.slice(0, 5) : "";
}

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, lineHeight: 1.35 },
  headerBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
  },
  title: { fontSize: 22, textAlign: "center" },
  subtitle: { fontSize: 12, textAlign: "center", color: "#666", marginTop: 8 },
  month: {
    backgroundColor: "#0f172a",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 6,
    textTransform: "capitalize",
  },
  eventRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    gap: 10,
  },
  dateCol: { width: 70, textAlign: "right", color: "#111", fontSize: 12 },
  contentCol: { flex: 1 },
  eventTitle: { fontSize: 12 },
  eventMeta: { fontSize: 9, color: "#666", marginTop: 2 },
  eventDesc: { fontSize: 10, color: "#444", marginTop: 3 },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    fontSize: 8,
    textAlign: "center",
    color: "#777",
  },
});

export default function AgendaDoc({
  year,
  events,
}: {
  year: number;
  events: AgendaRow[];
}) {
  // agrupar por mês (em ordem)
  const byMonth = new Map<string, AgendaRow[]>();
  (events ?? []).forEach((ev) => {
    const k = monthKey(ev.event_date);
    if (!byMonth.has(k)) byMonth.set(k, []);
    byMonth.get(k)!.push(ev);
  });
  const ordered = Array.from(byMonth.entries()).sort(
    (a, b) =>
      new Date(a[1][0]?.event_date || 0).getTime() -
      new Date(b[1][0]?.event_date || 0).getTime()
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Cabeçalho */}
        <View style={styles.headerBox} fixed>
          <Text style={styles.title}>Agenda ICM</Text>
          <Text style={styles.subtitle}>Ano {year}</Text>
        </View>

        {/* Conteúdo */}
        {events.length === 0 ? (
          <Text>Nenhum evento encontrado para este ano.</Text>
        ) : (
          ordered.map(([month, items]) => (
            <View key={month} wrap>
              <Text style={styles.month}>{month}</Text>
              <View>
                {items.map((ev, idx) => {
                  const d = dayStr(ev.event_date);
                  const t = timeStr(ev.event_time);
                  return (
                    <View key={idx} style={styles.eventRow} wrap={false}>
                      <Text style={styles.dateCol}>{d}</Text>
                      <View style={styles.contentCol}>
                        <Text style={styles.eventTitle}>{ev.title}</Text>
                        {!!t && <Text style={styles.eventMeta}>às {t}</Text>}
                        {!!ev.description && (
                          <Text style={styles.eventDesc}>{ev.description}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}

        {/* Rodapé */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Gerado pela Plataforma ICM — ${new Date().toLocaleString("pt-BR")} • Página ${pageNumber}/${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}