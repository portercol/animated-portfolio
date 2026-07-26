import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  type DocumentProps,
} from "@react-pdf/renderer";

import type { ReactElement } from "react";

import type { Invoice } from "@/types/invoice";

interface InvoicePdfDocumentProps {
  invoice: Invoice;
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },

  headerLeft: {
    width: "65%",
  },

  headerRight: {
    width: "30%",
    alignItems: "flex-end",
  },

  eyebrow: {
    color: "#0891b2",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 12,
    fontSize: 25,
    fontWeight: 700,
  },

  clientName: {
    marginTop: 10,
    color: "#475569",
    fontSize: 13,
  },

  label: {
    color: "#64748b",
    fontSize: 8,
    textTransform: "uppercase",
  },

  value: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: 700,
  },

  metadataGroup: {
    marginBottom: 12,
  },

  status: {
    marginBottom: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: 9,
    fontWeight: 700,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 13,
    fontWeight: 700,
  },

  table: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
  },

  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    color: "#475569",
    fontSize: 8,
    fontWeight: 700,
  },

  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  descriptionColumn: {
    width: "49%",
  },

  hoursColumn: {
    width: "13%",
    textAlign: "right",
  },

  rateColumn: {
    width: "18%",
    textAlign: "right",
  },

  amountColumn: {
    width: "20%",
    textAlign: "right",
  },

  itemDescription: {
    fontWeight: 700,
  },

  summary: {
    width: 260,
    marginTop: 26,
    marginLeft: "auto",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },

  summaryLabel: {
    color: "#64748b",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
  },

  totalLabel: {
    fontSize: 10,
    fontWeight: 700,
  },

  currency: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 8,
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: 700,
  },

  paidNotice: {
    marginTop: 34,
    padding: 14,
    borderRadius: 6,
    backgroundColor: "#ecfdf5",
    color: "#047857",
    fontSize: 10,
    fontWeight: 700,
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    right: 48,
    bottom: 32,
    left: 48,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    color: "#64748b",
    fontSize: 8,
    textAlign: "center",
  },
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function InvoicePdfDocument({
  invoice,
}: InvoicePdfDocumentProps): ReactElement<DocumentProps> {
  const subtotal = invoice.items.reduce(
    (total, item) => total + item.hours * item.rate,
    0,
  );

  return (
    <Document
      title={`Invoice ${invoice.invoiceNumber}`}
      author="Collin Porter"
      subject={invoice.projectTitle}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.eyebrow}>Client Invoice</Text>

            <Text style={styles.title}>
              {invoice.projectTitle}
            </Text>

            <Text style={styles.clientName}>
              {invoice.clientName}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.status}>
              {invoice.status}
            </Text>

            <View style={styles.metadataGroup}>
              <Text style={styles.label}>Invoice</Text>
              <Text style={styles.value}>
                {invoice.invoiceNumber}
              </Text>
            </View>

            <View style={styles.metadataGroup}>
              <Text style={styles.label}>Issued</Text>
              <Text style={styles.value}>
                {invoice.issueDate}
              </Text>
            </View>

            <View style={styles.metadataGroup}>
              <Text style={styles.label}>Due</Text>
              <Text style={styles.value}>
                {invoice.dueDate}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.descriptionColumn}>
                Description
              </Text>
              <Text style={styles.hoursColumn}>Hours</Text>
              <Text style={styles.rateColumn}>Rate</Text>
              <Text style={styles.amountColumn}>Amount</Text>
            </View>

            {invoice.items.map((item, index) => {
              const amount = item.hours * item.rate;

              return (
                <View
                  key={`${item.description}-${index}`}
                  style={styles.tableRow}
                  wrap={false}
                >
                  <Text
                    style={[
                      styles.descriptionColumn,
                      styles.itemDescription,
                    ]}
                  >
                    {item.description}
                  </Text>

                  <Text style={styles.hoursColumn}>
                    {item.hours}
                  </Text>

                  <Text style={styles.rateColumn}>
                    {formatCurrency(item.rate)}
                  </Text>

                  <Text style={styles.amountColumn}>
                    {formatCurrency(amount)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.currency}>USD</Text>
            </View>

            <Text style={styles.totalAmount}>
              {formatCurrency(subtotal)}
            </Text>
          </View>
        </View>

        {invoice.status === "Paid" && (
          <Text style={styles.paidNotice}>
            Paid in full — thank you for your business.
          </Text>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Invoice ${invoice.invoiceNumber} · Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}