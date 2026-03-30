import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PaymentPreviewRecord = {
  row_key: string;
  event_name: string;
  team_name: string | null;
  payment_screenshot_url: string | null;
};

type RegistrationRow = PaymentPreviewRecord & {
  source_table: string;
  id?: string | null;
  team_size: number | null;
  payment_status: string | null;
};

type EventSummary = {
  tableName: string;
  eventName: string;
  totalTeams: number;
  totalParticipants: number;
  pendingPayments: number;
  verifiedPayments: number;
};

type EventTableConfig = (typeof EVENT_TABLES)[number];

type EventDetailRow = PaymentPreviewRecord & {
  source_table: string;
  id?: string | null;
  team_size: number | null;
  lead_name: string | null;
  lead_email: string | null;
  lead_phone: string | null;
  lead_college: string | null;
  member2_name: string | null;
  member2_email: string | null;
  member2_phone: string | null;
  member2_college: string | null;
  member3_name: string | null;
  member3_email: string | null;
  member3_phone: string | null;
  member3_college: string | null;
  member4_name: string | null;
  member4_email: string | null;
  member4_phone: string | null;
  member4_college: string | null;
  payment_status: string | null;
  created_at: string | null;
};

const cardClass =
  "border-4 border-arcade-pink bg-zinc-950 shadow-[4px_4px_0px_#00FFFF]";

const metricCardClass =
  "border-2 border-zinc-800 bg-black px-4 py-4";

const EVENT_TABLES = [
  { eventName: "PaperX", tableName: "reg_paperx" },
  { eventName: "Canvas Clash", tableName: "reg_canvas_clash" },
  { eventName: "Brain and Buzzers", tableName: "reg_brain_and_buzzers" },
  { eventName: "Auction Mania", tableName: "reg_auction_mania" },
  { eventName: "Byteopia", tableName: "reg_byteopia" },
  { eventName: "Conquest", tableName: "reg_conquest" },
  { eventName: "The Gaming Lab: Outbreak edition", tableName: "reg_gaming_lab" },
  { eventName: "Mission Impossible", tableName: "reg_mission_impossible" },
] as const;

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentPreviewLoading, setIsPaymentPreviewLoading] = useState(false);
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState("");
  const [paymentPreviewError, setPaymentPreviewError] = useState("");
  const [activeRegistration, setActiveRegistration] = useState<PaymentPreviewRecord | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventTableConfig | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetailRow[]>([]);
  const [isEventDetailsLoading, setIsEventDetailsLoading] = useState(false);
  const [eventDetailsError, setEventDetailsError] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [verifyingRowKey, setVerifyingRowKey] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRegistrations = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const results = await Promise.all(
        EVENT_TABLES.map(async ({ eventName, tableName }) => {
          const { data, error } = await supabase
            .from(tableName)
            .select("id, team_name, team_size, payment_status, payment_screenshot_url");

          if (error) {
            throw new Error(`${eventName}: ${error.message}`);
          }

          return (data ?? []).map((row, index) => ({
            row_key: `${tableName}-${row.id ?? index}`,
            source_table: tableName,
            id: row.id ?? null,
            event_name: eventName,
            team_name: row.team_name ?? null,
            team_size: row.team_size ?? null,
            payment_status: row.payment_status ?? null,
            payment_screenshot_url: row.payment_screenshot_url ?? null,
          }));
        })
      );

      if (!isMounted) {
        return;
      }

      const combinedRegistrations = results.flat();

      setRegistrations(combinedRegistrations);
      setIsLoading(false);
    };

    fetchRegistrations().catch((error) => {
      if (!isMounted) {
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load registrations."
      );
      setRegistrations([]);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Sign out failed.");
      return;
    }

    toast.success("Signed out successfully.");
    navigate("/admin/login", { replace: true });
  };

  const fetchEventDetails = async (eventConfig: EventTableConfig) => {
    setSelectedEvent(eventConfig);
    setExpandedRows({});
    setEventDetails([]);
    setEventDetailsError("");
    setIsEventDetailsLoading(true);

    const { data, error } = await supabase
      .from(eventConfig.tableName)
      .select(
        "id, team_name, team_size, lead_name, lead_email, lead_phone, lead_college, member2_name, member2_email, member2_phone, member2_college, member3_name, member3_email, member3_phone, member3_college, member4_name, member4_email, member4_phone, member4_college, payment_status, created_at, payment_screenshot_url"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setEventDetailsError(error.message || "Failed to load event registrations.");
      setIsEventDetailsLoading(false);
      return;
    }

    const mappedRows: EventDetailRow[] = (data ?? []).map((row, index) => ({
      row_key: `${eventConfig.tableName}-${row.id ?? index}`,
      source_table: eventConfig.tableName,
      id: row.id ?? null,
      event_name: eventConfig.eventName,
      team_name: row.team_name ?? null,
      team_size: row.team_size ?? null,
      lead_name: row.lead_name ?? null,
      lead_email: row.lead_email ?? null,
      lead_phone: row.lead_phone ?? null,
      lead_college: row.lead_college ?? null,
      member2_name: row.member2_name ?? null,
      member2_email: row.member2_email ?? null,
      member2_phone: row.member2_phone ?? null,
      member2_college: row.member2_college ?? null,
      member3_name: row.member3_name ?? null,
      member3_email: row.member3_email ?? null,
      member3_phone: row.member3_phone ?? null,
      member3_college: row.member3_college ?? null,
      member4_name: row.member4_name ?? null,
      member4_email: row.member4_email ?? null,
      member4_phone: row.member4_phone ?? null,
      member4_college: row.member4_college ?? null,
      payment_status: row.payment_status ?? null,
      created_at: row.created_at ?? null,
      payment_screenshot_url: row.payment_screenshot_url ?? null,
    }));

    setEventDetails(mappedRows);
    setIsEventDetailsLoading(false);
  };

  const handleOpenPaymentPreview = async (registration: PaymentPreviewRecord) => {
    setActiveRegistration(registration);
    setIsPaymentModalOpen(true);
    setPaymentPreviewUrl("");
    setPaymentPreviewError("");

    if (!registration.payment_screenshot_url) {
      setPaymentPreviewError("No payment screenshot was uploaded for this registration.");
      return;
    }

    setIsPaymentPreviewLoading(true);

    const { data, error } = await supabase.storage
      .from("payment-screenshots")
      .createSignedUrl(registration.payment_screenshot_url, 60);

    if (error || !data?.signedUrl) {
      setPaymentPreviewError(error?.message || "Failed to generate payment preview.");
      setIsPaymentPreviewLoading(false);
      return;
    }

    setPaymentPreviewUrl(data.signedUrl);
    setIsPaymentPreviewLoading(false);
  };

  const toggleExpandedRow = (rowKey: string) => {
    setExpandedRows((current) => ({
      ...current,
      [rowKey]: !current[rowKey],
    }));
  };

  const handleVerifyPayment = async (row: EventDetailRow) => {
    if (!row.id || verifyingRowKey === row.row_key) {
      return;
    }

    setVerifyingRowKey(row.row_key);

    const { error } = await supabase
      .from(row.source_table)
      .update({ payment_status: "verified" })
      .eq("id", row.id);

    if (error) {
      toast.error(error.message || "Failed to verify payment.");
      setVerifyingRowKey("");
      return;
    }

    setEventDetails((current) =>
      current.map((item) =>
        item.row_key === row.row_key ? { ...item, payment_status: "verified" } : item
      )
    );
    setRegistrations((current) =>
      current.map((item) =>
        item.row_key === row.row_key ? { ...item, payment_status: "verified" } : item
      )
    );
    toast.success(`Payment verified for ${row.team_name || "team"}.`);
    setVerifyingRowKey("");
  };

  const groupedByEvent = registrations.reduce<Record<string, EventSummary>>((acc, registration) => {
    const eventName = registration.event_name.trim() || "Unknown Event";
    const paymentStatus = registration.payment_status?.trim().toLowerCase() || "pending";
    const teamSize = Number(registration.team_size) || 0;

    if (!acc[eventName]) {
      acc[eventName] = {
        eventName,
        totalTeams: 0,
        totalParticipants: 0,
        pendingPayments: 0,
        verifiedPayments: 0,
      };
    }

    acc[eventName].totalTeams += 1;
    acc[eventName].totalParticipants += teamSize;

    if (paymentStatus === "verified") {
      acc[eventName].verifiedPayments += 1;
    } else {
      acc[eventName].pendingPayments += 1;
    }

    return acc;
  }, {});

  const eventSummaries = EVENT_TABLES.map(({ eventName, tableName }) => {
    const summary = groupedByEvent[eventName];

    return {
      tableName,
      eventName,
      totalTeams: summary?.totalTeams ?? 0,
      totalParticipants: summary?.totalParticipants ?? 0,
      pendingPayments: summary?.pendingPayments ?? 0,
      verifiedPayments: summary?.verifiedPayments ?? 0,
    };
  });

  const grandTotals = eventSummaries.reduce(
    (totals, eventSummary) => ({
      totalEvents: totals.totalEvents + 1,
      totalTeams: totals.totalTeams + eventSummary.totalTeams,
      totalParticipants: totals.totalParticipants + eventSummary.totalParticipants,
      pendingPayments: totals.pendingPayments + eventSummary.pendingPayments,
      verifiedPayments: totals.verifiedPayments + eventSummary.verifiedPayments,
    }),
    {
      totalEvents: 0,
      totalTeams: 0,
      totalParticipants: 0,
      pendingPayments: 0,
      verifiedPayments: 0,
    }
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10 relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-[0] opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #3f3f46 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-[0] bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-arcade-cyan">
              Adsophos 2026
            </p>
            <h1
              className="mt-3 font-arcade text-3xl sm:text-4xl md:text-5xl text-white uppercase"
              style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
            >
              Admin Dashboard
            </h1>
            <p className="mt-4 max-w-2xl font-mono text-sm text-zinc-400 leading-7">
              Live registration summary grouped by event, with payment status totals across
              the entire fest.
            </p>
          </div>

          <Button type="button" variant="outline" onClick={handleSignOut}>
            LOGOUT
          </Button>
        </div>

        <section className={cardClass}>
          <div className="px-5 py-4 bg-arcade-pink text-black font-mono font-bold tracking-[0.25em] text-sm uppercase">
            Grand Total
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className={metricCardClass}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Events
              </p>
              <p className="mt-3 font-arcade text-2xl text-white">{grandTotals.totalEvents}</p>
            </div>
            <div className={metricCardClass}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Total Teams
              </p>
              <p className="mt-3 font-arcade text-2xl text-white">{grandTotals.totalTeams}</p>
            </div>
            <div className={metricCardClass}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Participants
              </p>
              <p className="mt-3 font-arcade text-2xl text-arcade-yellow">
                {grandTotals.totalParticipants}
              </p>
            </div>
            <div className={metricCardClass}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Pending Payments
              </p>
              <p className="mt-3 font-arcade text-2xl text-arcade-pink">
                {grandTotals.pendingPayments}
              </p>
            </div>
            <div className={metricCardClass}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Verified Payments
              </p>
              <p className="mt-3 font-arcade text-2xl text-arcade-cyan">
                {grandTotals.verifiedPayments}
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className={`${cardClass} px-6 py-10 text-center`}>
            <p className="font-arcade text-sm text-arcade-yellow uppercase tracking-widest">
              Loading registrations...
            </p>
          </div>
        ) : errorMessage ? (
          <div className={`${cardClass} px-6 py-10 text-center`}>
            <p className="font-mono text-sm text-arcade-pink">{errorMessage}</p>
          </div>
        ) : eventSummaries.length === 0 ? (
          <div className={`${cardClass} px-6 py-10 text-center`}>
            <p className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
              No registrations found yet.
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eventSummaries.map((eventSummary) => (
                <button
                  key={eventSummary.eventName}
                  type="button"
                  onClick={() =>
                    fetchEventDetails({
                      eventName: eventSummary.eventName,
                      tableName: eventSummary.tableName,
                    })
                  }
                  className={`${cardClass} text-left transition-transform hover:-translate-y-1 ${
                    selectedEvent?.eventName === eventSummary.eventName
                      ? "ring-2 ring-arcade-cyan"
                      : ""
                  }`}
                >
                  <div className="px-5 py-4 border-b-2 border-zinc-800 bg-black">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-arcade-cyan">
                      Event Summary
                    </p>
                    <h2 className="mt-2 font-arcade text-2xl text-white uppercase leading-tight">
                      {eventSummary.eventName}
                    </h2>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={metricCardClass}>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                        Teams Registered
                      </p>
                      <p className="mt-3 font-arcade text-2xl text-white">
                        {eventSummary.totalTeams}
                      </p>
                    </div>

                    <div className={metricCardClass}>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                        Participants
                      </p>
                      <p className="mt-3 font-arcade text-2xl text-arcade-yellow">
                        {eventSummary.totalParticipants}
                      </p>
                    </div>

                    <div className={metricCardClass}>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                        Pending Payments
                      </p>
                      <p className="mt-3 font-arcade text-2xl text-arcade-pink">
                        {eventSummary.pendingPayments}
                      </p>
                    </div>

                    <div className={metricCardClass}>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                        Verified Payments
                      </p>
                      <p className="mt-3 font-arcade text-2xl text-arcade-cyan">
                        {eventSummary.verifiedPayments}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </section>

            <section className={cardClass}>
              <div className="px-5 py-4 bg-arcade-pink text-black font-mono font-bold tracking-[0.25em] text-sm uppercase">
                {selectedEvent
                  ? `${selectedEvent.eventName} Details`
                  : "Select an Event Card"}
              </div>

              <div className="overflow-x-auto">
                {!selectedEvent ? (
                  <div className="px-6 py-10 text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      Click any event card above to load its detailed registrations.
                    </p>
                  </div>
                ) : isEventDetailsLoading ? (
                  <div className="px-6 py-10 text-center">
                    <p className="font-arcade text-sm text-arcade-yellow uppercase tracking-widest">
                      Loading event details...
                    </p>
                  </div>
                ) : eventDetailsError ? (
                  <div className="px-6 py-10 text-center">
                    <p className="font-mono text-sm text-arcade-pink">{eventDetailsError}</p>
                  </div>
                ) : (
                  <table className="w-full min-w-[1150px]">
                    <thead className="bg-black border-b-2 border-zinc-800">
                      <tr>
                        {[
                          "Team",
                          "Lead",
                          "Payment",
                          "Created",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-zinc-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eventDetails.length > 0 ? (
                        eventDetails.flatMap((registration) => {
                          const extraMembers = [
                            {
                              label: "Member 2",
                              name: registration.member2_name,
                              email: registration.member2_email,
                              phone: registration.member2_phone,
                              college: registration.member2_college,
                            },
                            {
                              label: "Member 3",
                              name: registration.member3_name,
                              email: registration.member3_email,
                              phone: registration.member3_phone,
                              college: registration.member3_college,
                            },
                            {
                              label: "Member 4",
                              name: registration.member4_name,
                              email: registration.member4_email,
                              phone: registration.member4_phone,
                              college: registration.member4_college,
                            },
                          ].filter((member) =>
                            [member.name, member.email, member.phone, member.college].some(Boolean)
                          );
                          const isExpanded = Boolean(expandedRows[registration.row_key]);

                          return [
                            <tr
                              key={registration.row_key}
                              className="border-b border-zinc-800 bg-zinc-950/90 align-top"
                            >
                              <td className="px-4 py-4">
                                <p className="font-mono text-xs text-white uppercase">
                                  {registration.team_name || "Unnamed Team"}
                                </p>
                                <p className="mt-2 font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                                  Team Size: {registration.team_size ?? "—"}
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <p className="font-mono text-xs text-white uppercase">
                                  {registration.lead_name || "—"}
                                </p>
                                <p className="mt-2 font-mono text-[11px] text-zinc-400">
                                  {registration.lead_email || "—"}
                                </p>
                                <p className="mt-1 font-mono text-[11px] text-zinc-500">
                                  {registration.lead_phone || "—"}
                                </p>
                                <p className="mt-1 font-mono text-[11px] text-zinc-500 uppercase">
                                  {registration.lead_college || "—"}
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                                    registration.payment_status?.toLowerCase() === "verified"
                                      ? "border-arcade-cyan text-arcade-cyan"
                                      : "border-arcade-pink text-arcade-pink"
                                  }`}
                                >
                                  {registration.payment_status || "pending"}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-mono text-xs text-zinc-400">
                                {formatDateTime(registration.created_at)}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="font-mono text-[11px] uppercase tracking-widest"
                                    onClick={() => handleOpenPaymentPreview(registration)}
                                    disabled={
                                      isPaymentPreviewLoading &&
                                      activeRegistration?.row_key === registration.row_key
                                    }
                                  >
                                    {isPaymentPreviewLoading &&
                                    activeRegistration?.row_key === registration.row_key
                                      ? "Loading..."
                                      : "View Payment"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="yellow"
                                    className="font-mono text-[11px] uppercase tracking-widest"
                                    onClick={() => handleVerifyPayment(registration)}
                                    disabled={
                                      registration.payment_status?.toLowerCase() === "verified" ||
                                      verifyingRowKey === registration.row_key ||
                                      !registration.id
                                    }
                                  >
                                    {verifyingRowKey === registration.row_key
                                      ? "Verifying..."
                                      : registration.payment_status?.toLowerCase() === "verified"
                                      ? "Verified"
                                      : "Verify Payment"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="font-mono text-[11px] uppercase tracking-widest"
                                    onClick={() => toggleExpandedRow(registration.row_key)}
                                    disabled={extraMembers.length === 0}
                                  >
                                    {extraMembers.length === 0
                                      ? "No Extra Members"
                                      : isExpanded
                                      ? "Hide Members"
                                      : "Expand Members"}
                                  </Button>
                                </div>
                              </td>
                            </tr>,
                            isExpanded ? (
                              <tr
                                key={`${registration.row_key}-expanded`}
                                className="border-b border-zinc-800 bg-black/80"
                              >
                                <td colSpan={5} className="px-4 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {extraMembers.map((member) => (
                                      <div
                                        key={`${registration.row_key}-${member.label}`}
                                        className="border-2 border-zinc-800 bg-zinc-950 px-4 py-3"
                                      >
                                        <p className="font-mono text-[10px] uppercase tracking-widest text-arcade-cyan">
                                          {member.label}
                                        </p>
                                        <p className="mt-3 font-mono text-xs text-white uppercase">
                                          {member.name || "—"}
                                        </p>
                                        <p className="mt-2 font-mono text-[11px] text-zinc-400">
                                          {member.email || "—"}
                                        </p>
                                        <p className="mt-1 font-mono text-[11px] text-zinc-500">
                                          {member.phone || "—"}
                                        </p>
                                        <p className="mt-1 font-mono text-[11px] text-zinc-500 uppercase">
                                          {member.college || "—"}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ) : null,
                          ].filter(Boolean);
                        })
                      ) : (
                        <tr className="bg-zinc-950/90">
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center font-mono text-xs uppercase tracking-widest text-zinc-500"
                          >
                            No registrations found for this event yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <Dialog
        open={isPaymentModalOpen}
        onOpenChange={(open) => {
          setIsPaymentModalOpen(open);

          if (!open) {
            setPaymentPreviewUrl("");
            setPaymentPreviewError("");
            setIsPaymentPreviewLoading(false);
            setActiveRegistration(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl border-4 border-arcade-pink bg-zinc-950 text-white shadow-[4px_4px_0px_#00FFFF]">
          <DialogHeader>
            <DialogTitle className="font-arcade text-xl text-arcade-yellow uppercase">
              Payment Preview
            </DialogTitle>
            <DialogDescription className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {activeRegistration?.team_name || "Selected Team"} -{" "}
              {activeRegistration?.event_name || "Selected Event"}
            </DialogDescription>
          </DialogHeader>

          <div className="border-2 border-zinc-800 bg-black p-4 min-h-[320px] flex items-center justify-center">
            {isPaymentPreviewLoading ? (
              <p className="font-arcade text-sm text-arcade-cyan uppercase tracking-widest">
                Fetching signed URL...
              </p>
            ) : paymentPreviewError ? (
              <p className="font-mono text-sm text-arcade-pink text-center">
                {paymentPreviewError}
              </p>
            ) : paymentPreviewUrl ? (
              <img
                src={paymentPreviewUrl}
                alt="Payment screenshot"
                className="max-h-[70vh] w-auto max-w-full object-contain border-2 border-arcade-pink shadow-[3px_3px_0px_#00FFFF]"
              />
            ) : (
              <p className="font-mono text-sm text-zinc-500 text-center uppercase tracking-widest">
                No payment preview available.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
