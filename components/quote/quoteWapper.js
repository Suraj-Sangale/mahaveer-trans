"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/quote.module.css";
import {
  SERVICE_LIST,
  SERVICES,
  TICKER_ITEMS,
  COMMODITY_OPTIONS,
  PACKAGING_OPTIONS,
  SPECIAL_HANDLING_OPTIONS,
  PICKUP_OPTIONS,
  DELIVERY_OPTIONS,
  FREQUENCY_OPTIONS,
  INCOTERMS,
  ADDONS,
  STEP_PROGRESS,
  formatINR,
  calcEstimate,
  buildDateOptions,
  pickRandomUrgencyCount,
  generateReference,
} from "@/utilities/masterData";

// tiny classnames helper — avoids pulling in a dependency
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

// ── Tooltip component ──
function Tooltip({ text }) {
  return (
    <span className={styles.tooltipWrap} tabIndex={0} aria-label={text}>
      <span className={styles.tooltipIcon}>i</span>
      <span className={styles.tooltipBubble} role="tooltip">
        {text}
      </span>
    </span>
  );
}

const TOTAL_STEPS = 4;

export default function QuoteWrapper() {
  // ── step / navigation ──
  const [step, setStep] = useState(1);

  // ── step 1: service ──
  const [selectedSvc, setSelectedSvc] = useState(null);

  // ── step 2: cargo ──
  const [commodity, setCommodity] = useState("");
  const [hscode, setHscode] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [pieces, setPieces] = useState("");
  const [packaging, setPackaging] = useState("");
  const [cargoValue, setCargoValue] = useState("");
  const [specialHandling, setSpecialHandling] = useState([]);

  // ── step 3: route ──
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupType, setPickupType] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [incoterm, setIncoterm] = useState("EXW");
  const [frequency, setFrequency] = useState("");
  const dateOptions = useMemo(() => buildDateOptions(), []);
  const [selectedDateId, setSelectedDateId] = useState(
    dateOptions[0]?.id ?? null,
  );

  // ── step 4: add-ons + contact ──
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [cName, setCName] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cNotes, setCNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const errorTimer = useRef(null);

  // ── success ──
  const [reference, setReference] = useState("");

  // ── misc UI state ──
  const [urgencyCount, setUrgencyCount] = useState(0);

  // Inject the display/body fonts once, on mount
  useEffect(() => {
    setUrgencyCount(pickRandomUrgencyCount());
    const id = "quote-form-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => () => clearTimeout(errorTimer.current), []);

  // ── derived values ──
  const addonTotal = useMemo(
    () =>
      selectedAddons.reduce((sum, key) => {
        const a = ADDONS.find((x) => x.key === key);
        return sum + (a ? a.price : 0);
      }, 0),
    [selectedAddons],
  );

  const estimate = useMemo(
    () => (selectedSvc ? calcEstimate(selectedSvc, weight, addonTotal) : 0),
    [selectedSvc, weight, addonTotal],
  );

  const svc = selectedSvc ? SERVICES[selectedSvc] : null;

  // mirrors the original inline formula: min(20 + (step-1)*25, 100)
  const estCompletionPct = Math.min(20 + (step - 1) * 25, 100);
  const progressPct = STEP_PROGRESS[step - 1] ?? 5;

  const weightNum = parseFloat(weight) || 1;
  const sumWeightText = weightNum > 1 ? `${weightNum} kg` : "—";
  const sumRouteText =
    origin && destination ? `${origin} → ${destination}` : "—";
  const sumAddonsText = selectedAddons.length
    ? selectedAddons
        .map((key) => ADDONS.find((a) => a.key === key)?.name)
        .join(", ")
    : "None";

  // ── handlers ──
  function goStep(n) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleSpecial(label) {
    setSpecialHandling((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }

  function toggleAddon(key) {
    setSelectedAddons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function submitForm() {
    const errs = {};
    if (!cName.trim()) errs.cName = true;
    if (!cEmail.trim()) errs.cEmail = true;
    if (!cPhone.trim()) errs.cPhone = true;

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => setFieldErrors({}), 2500);
      return;
    }

    setReference(generateReference());
    goStep(5);
  }

  // ── ticker content (duplicated once, for a seamless loop) ──
  const tickerRow = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className={styles.root}>
      {/* TICKER */}
      <div className={styles.tickerWrap}>
        <div className={styles.ticker}>
          {tickerRow.map((t, i) => (
            <span className={styles.tItem} key={`${t}-${i}`}>
              <span className={styles.tDot} />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.pageWrap}>
        {/* ═══ LEFT PANEL ═══ */}
        <div className={styles.leftPanel}>
          <div className={styles.lpGrid} />
          <div className={styles.lpGlow} />
          <div className={styles.lpGlow2} />

          <div className={styles.lpContent}>
            <div className={styles.secTag}>Get Your Quote</div>
            <h1 className={styles.lpH}>
              Instant Pricing.
              <br />
              <span className={styles.hl}>Zero Surprises.</span>
            </h1>
            <p className={styles.lpDesc}>
              Fill the 4-step form for a detailed quote in under 2 minutes. A
              dedicated account manager reviews every submission within 1
              business hour.
            </p>

            <div className={styles.urgency}>
              <span className={styles.urgencyDot} />
              <span>{urgencyCount} quotes requested in the last 24 hours</span>
            </div>

            <div className={styles.trustPills}>
              <span className={styles.tp}>
                <span
                  className={styles.tpDot}
                  style={{ background: "#16a34a" }}
                />
                99% on-time delivery
              </span>
              <span className={styles.tp}>
                <span
                  className={styles.tpDot}
                  style={{ background: "#0ea5e9" }}
                />
                180+ countries
              </span>
              <span className={styles.tp}>
                <span
                  className={styles.tpDot}
                  style={{ background: "#f59e0b" }}
                />
                No hidden fees
              </span>
              <span className={styles.tp}>
                <span
                  className={styles.tpDot}
                  style={{ background: "#7c3aed" }}
                />
                GDP & IMDG certified
              </span>
              <span className={styles.tp}>
                <span
                  className={styles.tpDot}
                  style={{ background: "#dc2626" }}
                />
                24/7 live support
              </span>
              <span className={styles.tp}>
                <span
                  className={styles.tpDot}
                  style={{ background: "#0ea5e9" }}
                />
                1-hour quote review
              </span>
            </div>
          </div>

          {/* LIVE ESTIMATE CARD */}
          <div className={styles.estCard}>
            <div className={styles.estLabel}>Live Estimate</div>
            <div className={styles.estPrice}>
              <span>₹</span>
              <span>{svc ? formatINR(estimate) : "—"}</span>
              <span>{svc ? ` · ${svc.unit}` : " · select a service"}</span>
            </div>
            <div className={styles.estNote}>
              {svc
                ? `Estimated range. Includes base rate${addonTotal > 0 ? " + selected add-ons." : "."}`
                : "Estimated range based on typical shipments. Final price after review."}
            </div>
            <div className={styles.estRow}>
              <div className={styles.estPill}>
                <div className={styles.estPillV}>{svc ? svc.transit : "—"}</div>
                <div className={styles.estPillL}>Transit days</div>
              </div>
              <div className={styles.estPill}>
                <div className={styles.estPillV}>{svc ? svc.carbon : "—"}</div>
                <div className={styles.estPillL}>CO₂ estimate</div>
              </div>
              <div className={styles.estPill}>
                <div className={styles.estPillV}>{svc ? svc.sla : "—"}</div>
                <div className={styles.estPillL}>SLA level</div>
              </div>
            </div>
            <div className={styles.estBar}>
              <div
                className={styles.estFill}
                style={{ width: `${estCompletionPct}%` }}
              />
            </div>
            <div className={styles.estFooter}>
              <span>{svc ? svc.name : "No service selected"}</span>
              <span>{estCompletionPct}% complete</span>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL (FORM) ═══ */}
        <div className={styles.rightPanel}>
          {/* STEPPER */}
          <div className={styles.stepper}>
            {["Service", "Cargo", "Route", "Details"].map((label, idx) => {
              const n = idx + 1;
              const state = n < step ? "done" : n === step ? "active" : "idle";
              return (
                <React.Fragment key={label}>
                  <div className={styles.stepItem}>
                    <div className={cx(styles.stepNum, styles[state])}>
                      {state === "done" ? "✓" : n}
                    </div>
                    <div
                      className={cx(
                        styles.stepLabel,
                        state !== "idle" && styles[state],
                      )}
                    >
                      {label}
                    </div>
                  </div>
                  {n < TOTAL_STEPS && (
                    <div
                      className={cx(
                        styles.stepLine,
                        n < step && styles.done,
                        n === step && styles.active,
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* PROGRESS BAR */}
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* ── STEP 1: SERVICE TYPE ── */}
          <div className={cx(styles.formStep, step === 1 && styles.active)}>
            <h2 className={styles.stepH}>What are you shipping?</h2>
            <p className={styles.stepSub}>
              Choose the service that best matches your shipment. You can refine
              later.
            </p>

            <div className={styles.svcGrid}>
              {SERVICE_LIST.map((s) => (
                <label
                  key={s.key}
                  className={cx(
                    styles.svcOpt,
                    selectedSvc === s.key && styles.selected,
                  )}
                  onClick={() => setSelectedSvc(s.key)}
                >
                  <input
                    type="radio"
                    name="svc"
                    value={s.key}
                    checked={selectedSvc === s.key}
                    readOnly
                  />
                  <div className={styles.svcOptIcon}>{s.icon}</div>
                  <div>
                    <div className={styles.svcOptName}>{s.name}</div>
                    <div className={styles.svcOptDesc}>{s.desc}</div>
                  </div>
                  <div className={styles.svcOptCheck}>✓</div>
                </label>
              ))}
            </div>

            <div className={styles.btnRow}>
              <button
                className={styles.btnNext}
                disabled={!selectedSvc}
                onClick={() => goStep(2)}
              >
                Continue to Cargo Details <span>→</span>
              </button>
            </div>
          </div>

          {/* ── STEP 2: CARGO DETAILS ── */}
          <div className={cx(styles.formStep, step === 2 && styles.active)}>
            <h2 className={styles.stepH}>Tell us about your cargo</h2>
            <p className={styles.stepSub}>
              Accurate dimensions help us give you the best price — estimates
              are fine.
            </p>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Commodity type<span className={styles.req}>*</span>
                  <Tooltip text="Select the category that best describes your goods — affects regulatory routing and tariff classification." />
                </label>
                <select
                  className={styles.fieldSelect}
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                >
                  <option value="">Select category</option>
                  {COMMODITY_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  HS Code{" "}
                  <span style={{ color: "var(--muted2)", fontWeight: 400 }}>
                    (optional)
                  </span>
                  <Tooltip text="Harmonised System code for your product (e.g. 8471.30). Helps expedite customs clearance." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. 8471.30"
                  value={hscode}
                  onChange={(e) => setHscode(e.target.value)}
                />
                <span className={styles.fieldHint}>
                  Leave blank if unknown — we'll classify for you.
                </span>
              </div>
            </div>

            <div className={cx(styles.fieldRow, styles.triple)}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Weight (kg)<span className={styles.req}>*</span>
                  <Tooltip text="Total gross weight of the shipment in kilograms — used to calculate freight cost and chargeable weight." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min="0.1"
                  placeholder="e.g. 250"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Volume (CBM)<span className={styles.req}>*</span>
                  <Tooltip text="Cubic metres (L × W × H ÷ 1,000,000) — we use the higher of actual vs. volumetric weight to quote you fairly." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 1.5"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  No. of pieces
                  <Tooltip text="Total count of individual packages, cartons, or pallets in this shipment." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={pieces}
                  onChange={(e) => setPieces(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Packaging type<span className={styles.req}>*</span>
                  <Tooltip text="How your cargo is packed — determines handling equipment, stacking rules, and container compatibility." />
                </label>
                <select
                  className={styles.fieldSelect}
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                >
                  <option value="">Select type</option>
                  {PACKAGING_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Cargo value (₹)<span className={styles.req}>*</span>
                  <Tooltip text="Declared commercial value of the goods in INR — used to compute cargo insurance premium." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  placeholder="e.g. 500000"
                  value={cargoValue}
                  onChange={(e) => setCargoValue(e.target.value)}
                />
                <span className={styles.fieldHint}>
                  Required for insurance calculation.
                </span>
              </div>
            </div>

            <div className={cx(styles.fieldRow, styles.single)}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Special handling requirements
                  <Tooltip text="Select any requirements that apply — these may affect routing, carrier selection, and regulatory compliance." />
                </label>
                <div className={styles.specialRow}>
                  {SPECIAL_HANDLING_OPTIONS.map((label) => (
                    <label className={styles.specialLabel} key={label}>
                      <input
                        type="checkbox"
                        checked={specialHandling.includes(label)}
                        onChange={() => toggleSpecial(label)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.btnBack} onClick={() => goStep(1)}>
                ← Back
              </button>
              <button className={styles.btnNext} onClick={() => goStep(3)}>
                Continue to Route →
              </button>
            </div>
          </div>

          {/* ── STEP 3: ROUTE & DATE ── */}
          <div className={cx(styles.formStep, step === 3 && styles.active)}>
            <h2 className={styles.stepH}>Origin, destination & timing</h2>
            <p className={styles.stepSub}>
              Tell us where it needs to go and when. We'll plan the fastest,
              most cost-effective route.
            </p>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Origin city / port<span className={styles.req}>*</span>
                  <Tooltip text="City or port where the cargo will be collected or handed over to us (e.g. Mumbai, JNPT)." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. Mumbai, India"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Destination city / port<span className={styles.req}>*</span>
                  <Tooltip text="Final delivery city or port — determines transit lanes, duties, and local delivery charges." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. Frankfurt, Germany"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Pickup type<span className={styles.req}>*</span>
                  <Tooltip text="Door pickup means we collect from your premises; port drop-off means you deliver to our terminal." />
                </label>
                <select
                  className={styles.fieldSelect}
                  value={pickupType}
                  onChange={(e) => setPickupType(e.target.value)}
                >
                  <option value="">Select</option>
                  {PICKUP_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Delivery type<span className={styles.req}>*</span>
                  <Tooltip text="Door delivery means we bring cargo to the consignee; port collection means the receiver picks it up at the port." />
                </label>
                <select
                  className={styles.fieldSelect}
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                >
                  <option value="">Select</option>
                  {DELIVERY_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className={styles.fieldGroup}
              style={{ marginBottom: ".85rem" }}
            >
              <label className={styles.fieldLabel}>
                Incoterm<span className={styles.req}>*</span>
                <Tooltip text="International trade term defining who bears cost and risk at each stage (e.g. EXW = seller's warehouse, DDP = buyer's door)." />
              </label>
              <div className={styles.incoRow}>
                {INCOTERMS.map((v) => (
                  <label
                    key={v}
                    className={cx(
                      styles.incoOpt,
                      incoterm === v && styles.selected,
                    )}
                    onClick={() => setIncoterm(v)}
                  >
                    {v}
                    <input
                      type="radio"
                      name="inco"
                      value={v}
                      checked={incoterm === v}
                      readOnly
                      style={{ display: "none" }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div
              className={styles.fieldGroup}
              style={{ marginBottom: ".85rem" }}
            >
              <label className={styles.fieldLabel}>
                Preferred ready date<span className={styles.req}>*</span>
                <Tooltip text="The date your cargo will be packed and ready for pickup or drop-off — we schedule around this." />
              </label>
              <div className={styles.dateStrip}>
                {dateOptions.map((d) => (
                  <div
                    key={d.id}
                    className={cx(
                      styles.dateChip,
                      selectedDateId === d.id && styles.selected,
                      d.id === "custom" && styles.dateChipCustom,
                    )}
                    onClick={() => setSelectedDateId(d.id)}
                  >
                    {d.id === "custom" ? (
                      "Pick date"
                    ) : (
                      <>
                        <div className={styles.dateChipD}>{d.day}</div>
                        <div className={styles.dateChipM}>{d.label}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={cx(styles.fieldRow, styles.single)}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Shipment frequency
                  <Tooltip text="How often you ship similar cargo — regular shippers qualify for preferential rates and a dedicated lane manager." />
                </label>
                <select
                  className={styles.fieldSelect}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="">One-time shipment</option>
                  {FREQUENCY_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <span className={styles.fieldHint}>
                  Regular shippers get preferential rates and a dedicated lane
                  manager.
                </span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.btnBack} onClick={() => goStep(2)}>
                ← Back
              </button>
              <button className={styles.btnNext} onClick={() => goStep(4)}>
                Continue to Contact →
              </button>
            </div>
          </div>

          {/* ── STEP 4: ADD-ONS + CONTACT ── */}
          <div className={cx(styles.formStep, step === 4 && styles.active)}>
            <h2 className={styles.stepH}>Add-ons & your details</h2>
            <p className={styles.stepSub}>
              Enhance your shipment, then tell us who to send the quote to.
            </p>

            <div className={styles.addonList}>
              {ADDONS.map((a) => (
                <label
                  key={a.key}
                  className={cx(
                    styles.addonItem,
                    selectedAddons.includes(a.key) && styles.selected,
                  )}
                  onClick={() => toggleAddon(a.key)}
                >
                  <div className={styles.addonLeft}>
                    <div className={styles.addonIcon}>{a.icon}</div>
                    <div>
                      <div className={styles.addonName}>{a.name}</div>
                      <div className={styles.addonDesc}>{a.desc}</div>
                    </div>
                  </div>
                  <div className={styles.addonRight}>
                    <div className={styles.addonPrice}>
                      +₹{formatINR(a.price)}
                    </div>
                    <div className={styles.addonCheck}>✓</div>
                  </div>
                </label>
              ))}
            </div>

            {/* QUOTE SUMMARY */}
            <div className={styles.summaryCard}>
              <div className={styles.sumH}>Quote Summary</div>
              <div className={styles.sumRow}>
                <span className={styles.sumKey}>Service</span>
                <span className={cx(styles.sumVal, styles.accent)}>
                  {svc ? svc.name : "—"}
                </span>
              </div>
              <div className={styles.sumRow}>
                <span className={styles.sumKey}>Route</span>
                <span className={styles.sumVal}>{sumRouteText}</span>
              </div>
              <div className={styles.sumRow}>
                <span className={styles.sumKey}>Cargo weight</span>
                <span className={styles.sumVal}>{sumWeightText}</span>
              </div>
              <div className={styles.sumRow}>
                <span className={styles.sumKey}>Transit time</span>
                <span className={styles.sumVal}>{svc ? svc.transit : "—"}</span>
              </div>
              <div className={styles.sumRow}>
                <span className={styles.sumKey}>Add-ons</span>
                <span className={styles.sumVal}>{sumAddonsText}</span>
              </div>
              <div className={styles.sumTotal}>
                <div className={styles.sumTotalL}>Estimated Total</div>
                <div className={styles.sumTotalV}>
                  <span className={styles.cur}>₹ </span>
                  {svc ? formatINR(estimate) : "—"}
                </div>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className={styles.contactCard}>
              <div className={styles.contactCardIcon}>⚡</div>
              <div className={styles.contactCardText}>
                <strong>Response within 1 business hour.</strong> A dedicated
                logistics manager will call or email you to confirm the quote,
                discuss any special requirements, and activate your shipment.
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Full name<span className={styles.req}>*</span>
                  <Tooltip text="Your full name so our account manager can address you correctly when following up." />
                </label>
                <input
                  className={cx(
                    styles.fieldInput,
                    fieldErrors.cName && styles.error,
                  )}
                  type="text"
                  placeholder="Rajesh Sharma"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Company<span className={styles.req}>*</span>
                  <Tooltip text="Your registered business name — required for commercial invoicing and credit checks." />
                </label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="Acme Exports Ltd."
                  value={cCompany}
                  onChange={(e) => setCCompany(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Email<span className={styles.req}>*</span>
                  <Tooltip text="We'll send your detailed quote and shipment confirmation to this address." />
                </label>
                <input
                  className={cx(
                    styles.fieldInput,
                    fieldErrors.cEmail && styles.error,
                  )}
                  type="email"
                  placeholder="rajesh@acme.com"
                  value={cEmail}
                  onChange={(e) => setCEmail(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Phone / WhatsApp<span className={styles.req}>*</span>
                  <Tooltip text="Our ops team will call or message you on this number to confirm details and activate your shipment." />
                </label>
                <input
                  className={cx(
                    styles.fieldInput,
                    fieldErrors.cPhone && styles.error,
                  )}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                />
              </div>
            </div>
            <div className={cx(styles.fieldRow, styles.single)}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Additional notes
                  <Tooltip text="Any special requirements, delivery instructions, or questions you'd like our team to know before reviewing your quote." />
                </label>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Any special requirements, references, or questions for our team…"
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.btnBack} onClick={() => goStep(3)}>
                ← Back
              </button>
              <button className={styles.btnSubmit} onClick={submitForm}>
                <span>🚀</span> Request My Quote — Free
              </button>
            </div>
          </div>

          {/* ── SUCCESS ── */}
          <div className={cx(styles.formStep, step === 5 && styles.active)}>
            <div className={styles.successWrap}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.successH}>Quote Request Received!</h2>
              <p className={styles.successSub}>
                Your request has been assigned to a dedicated account manager.
                Expect a response within 1 business hour.
              </p>
              <div className={styles.successRef}>
                {reference || "#MT-2025-XXXXX"}
              </div>
              <div className={styles.successNext}>
                <div className={styles.snItem}>
                  <span className={styles.snIcon}>📍</span>Track a shipment in
                  real time
                </div>
                <div className={styles.snItem}>
                  <span className={styles.snIcon}>🛳️</span>Explore all service
                  options
                </div>
                <div className={styles.snItem}>
                  <span className={styles.snIcon}>📥</span>Download quote
                  summary PDF
                </div>
                <div className={styles.snItem}>
                  <span className={styles.snIcon}>💬</span>Chat with our team on
                  WhatsApp
                </div>
              </div>
            </div>
          </div>

          {/* PHONE STRIP */}
          {step !== 5 && (
            <div className={styles.phoneStrip} style={{ marginTop: "2rem" }}>
              <div className={styles.phText}>
                <strong>Prefer to talk?</strong>
                <br />
                Our ops team is available 24/7 to build a custom quote over the
                phone.
              </div>
              <button className={styles.phBtn}>📞 +91 22 4001 8000</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
