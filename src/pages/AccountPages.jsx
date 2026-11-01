import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    Check,
    Heart,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    Settings,
    User,
    Camera,
} from "lucide-react";
import {
    EmptyState,
    Field,
    LocationPicker,
    PageIntro,
    PhotoUpload,
    SearchBox,
    StatusBadge,
} from "../components/Controls";
import { organizations, photoUrl } from "../data";

export function ReportPage({
    onSubmit,
    orgs = organizations,
    inModal = false,
}) {
    const [address, setAddress] = useState(""),
        [loc, setLoc] = useState(null),
        [confirmed, setConfirmed] = useState(false),
        [photo, setPhoto] = useState(null);
    return (
        <main className={inModal ? "report-modal-content" : "page-shell"}>
            {!inModal && (
                <PageIntro
                    eyebrow="Community reporting"
                    title="Report an animal"
                    text="Share what you observed so relevant organizations can review the information."
                />
            )}
            <div className="report-layout">
                <form
                    className="content-panel report-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!address.trim() || !confirmed || !loc) return;
                        const f = new FormData(e.currentTarget);
                        onSubmit({
                            ...Object.fromEntries(f),
                            address,
                            location: loc,
                            photo,
                        });
                        setAddress("");
                        setLoc(null);
                        setConfirmed(false);
                        setPhoto(null);
                        e.currentTarget.reset();
                    }}
                >
                    <div className="form-title">
                        <div className="feature-icon">📍</div>
                        <div>
                            <h2>Tell us what happened</h2>
                            <p>
                                Fields marked * are required. Include a
                                confirmed pin so organizations can locate the
                                animal.
                            </p>
                        </div>
                    </div>
                    <div className="form-grid">
                        <Field label="Type of concern *">
                            <select name="kind" required>
                                <option>Stray animal</option>
                                <option>Lost pet</option>
                                <option>Found pet</option>
                                <option>Injured animal</option>
                                <option>Abandoned animal</option>
                                <option>Other concern</option>
                            </select>
                        </Field>
                        <Field label="Organization to notify *">
                            <select name="orgId" required>
                                {orgs.map((o) => (
                                    <option key={o.id} value={o.id}>
                                        {o.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Animal type *">
                            <select name="animalType" required>
                                <option>Dog</option>
                                <option>Cat</option>
                                <option>Other / unsure</option>
                            </select>
                        </Field>
                        <Field label="Breed, if known">
                            <input
                                name="breed"
                                placeholder="e.g. Aspin, domestic shorthair"
                            />
                        </Field>
                        <Field label="Observed condition *">
                            <select name="condition" required>
                                <option value="" disabled selected>
                                    Select a condition
                                </option>
                                <option>Appears well</option>
                                <option>Needs attention</option>
                                <option>Injured</option>
                                <option>Unknown</option>
                            </select>
                        </Field>
                        <Field label="Description *" wide>
                            <textarea
                                name="description"
                                required
                                rows="4"
                                placeholder="Appearance, behavior, collar, and other useful details…"
                            />
                        </Field>
                        <Field label="Address or location description *" wide>
                            <LocationPicker
                                address={address}
                                setAddress={setAddress}
                                confirmed={confirmed}
                                setConfirmed={setConfirmed}
                                location={loc}
                                setLocation={setLoc}
                            />
                        </Field>
                        <Field label="Photograph (optional)" wide>
                            <PhotoUpload value={photo} onChange={setPhoto} />
                        </Field>
                        <div className="span2">
                            <button
                                className="btn btn-primary"
                                disabled={!confirmed || !address.trim()}
                            >
                                Submit report <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                    <p className="form-disclaimer">
                        Reports are shared with participating organizations for
                        review. Recorded status updates do not independently
                        confirm physical rescue.
                    </p>
                </form>
                <aside className="report-aside">
                    <div className="panel">
                        <div className="kicker">What happens next</div>
                        <h3>Your report stays with you</h3>
                        {[
                            [
                                "01",
                                "We record the details",
                                "Your report receives a reference number.",
                            ],
                            [
                                "02",
                                "Relevant groups can review",
                                "Participating organizations may check the information.",
                            ],
                            [
                                "03",
                                "Follow updates",
                                "Review recorded status changes in My Reports.",
                            ],
                        ].map(([n, t, d]) => (
                            <div className="step" key={n}>
                                <b>{n}</b>
                                <div>
                                    <strong>{t}</strong>
                                    <p>{d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    );
}

export function UserDashboard({
    reports,
    inquiries,
    favorites,
    pets,
    alerts = [],
    onDismissAlert,
    onNavigate,
    onReport,
    onDetails,
}) {
    return (
        <main className="dashboard-shell">
            <PageIntro
                eyebrow="Your workspace"
                title="Welcome back"
                text="Your reports, adoption inquiries, and account activity in one place."
                action={
                    <button
                        className="btn btn-primary"
                        onClick={() => onNavigate("Report an animal")}
                    >
                        ＋ New report
                    </button>
                }
            />
            {alerts
                .filter((a) => !a.read)
                .map((alert) => (
                    <article className="account-alert" key={alert.id}>
                        <span className="alert-icon">●</span>
                        <div>
                            <b>{alert.title}</b>
                            <p>{alert.message}</p>
                            <small>{alert.date}</small>
                        </div>
                        <button
                            className="table-action"
                            onClick={() => onDismissAlert?.(alert.id)}
                        >
                            Mark read
                        </button>
                    </article>
                ))}
            <div className="dash-stats">
                {[
                    [reports.length, "My reports", "Recorded updates"],
                    [
                        inquiries.length,
                        "Adoption inquiries",
                        "Sent to organizations",
                    ],
                    [favorites.length, "Favorites", "Saved to your account"],
                    [2, "Messages", "Organization conversations"],
                ].map(([n, l, s]) => (
                    <article className="stat" key={l}>
                        <div className="stat-label">{l}</div>
                        <div className="stat-num">{n}</div>
                        <div className="stat-note">{s}</div>
                    </article>
                ))}
            </div>
            <div className="dash-grid">
                <section className="activity">
                    <div className="box-head">
                        <h2>Recent reports</h2>
                        <button
                            className="text-link"
                            onClick={() => onNavigate("My Reports")}
                        >
                            All reports →
                        </button>
                    </div>
                    {reports.slice(0, 3).map((r) => (
                        <button
                            className="activity-row activity-button"
                            key={r.id}
                            onClick={() => onReport(r)}
                        >
                            <span className="dot" />
                            <span>
                                {r.kind}
                                <small>
                                    {r.id} · {r.place}
                                </small>
                            </span>
                            <StatusBadge status={r.status} />
                        </button>
                    ))}
                    {!reports.length && (
                        <EmptyState
                            title="No reports yet"
                            text="Submit a report to start tracking updates."
                        />
                    )}
                </section>
                <section className="quick">
                    <div className="box-head">
                        <h2>Quick actions</h2>
                    </div>
                    <div className="quick-grid">
                        {[
                            ["📍", "New report", "Report an animal"],
                            ["♡", "Adoption listings", "Adopt"],
                            ["✉", "Messages", "Messages"],
                            ["⚙", "Profile & settings", "Profile"],
                        ].map(([i, l, t]) => (
                            <button
                                className="quick-btn"
                                key={l}
                                onClick={() => onNavigate(t)}
                            >
                                <span>{i}</span>
                                {l}
                                <ArrowRight size={14} />
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            <section className="content-panel report-history">
                <div className="box-head">
                    <div>
                        <h2>Your adoption inquiries</h2>
                        <p>See inquiries submitted for specific animals.</p>
                    </div>
                    <button
                        className="text-link"
                        onClick={() => onNavigate("Messages")}
                    >
                        Open messages →
                    </button>
                </div>
                {inquiries.length ? (
                    <div className="inquiry-list">
                        {inquiries.map((i) => (
                            <div className="inquiry-row" key={i.id}>
                                <b>{i.petName}</b>
                                <span>{i.orgName}</span>
                                <span>{i.date}</span>
                                <StatusBadge status={i.status || "Pending"} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No inquiries yet"
                        text="Open an animal listing to send an adoption inquiry."
                        action={
                            <button
                                className="btn btn-soft"
                                onClick={() => onNavigate("Adopt")}
                            >
                                Browse animals
                            </button>
                        }
                    />
                )}
            </section>
        </main>
    );
}

export function MyReportsPage({ reports, onReport, onNavigate }) {
    return (
        <main className="page-shell">
            <PageIntro
                eyebrow="Your account"
                title="My Reports"
                text="Review submissions and status information recorded by authorized organizations."
                action={
                    <button
                        className="btn btn-primary"
                        onClick={() => onNavigate("Report an animal")}
                    >
                        ＋ New Report
                    </button>
                }
            />
            <div className="content-panel">
                <ReportTable reports={reports} onOpen={onReport} />
            </div>
        </main>
    );
}
function ReportTable({ reports, onOpen }) {
    return reports.length ? (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>REPORT</th>
                        <th>ANIMAL</th>
                        <th>LOCATION</th>
                        <th>SUBMITTED</th>
                        <th>RECORDED STATUS</th>
                        <th>REVIEW</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {reports.map((r) => (
                        <tr key={r.id}>
                            <td>
                                <b>{r.id}</b>
                                <small>{r.kind}</small>
                            </td>
                            <td>
                                {r.animalType} · {r.breed || "Unknown"}
                            </td>
                            <td>{r.place}</td>
                            <td>{r.date}</td>
                            <td>
                                <StatusBadge status={r.status} />
                            </td>
                            <td>
                                <StatusBadge
                                    status={r.approvalStatus || "Pending"}
                                />
                            </td>
                            <td>
                                <button
                                    className="table-action"
                                    onClick={() => onOpen(r)}
                                >
                                    Details →
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <EmptyState
            title="No reports submitted"
            text="Animal reports you create will appear here."
        />
    );
}

export function FavoritesPage({
    favorites,
    pets,
    toggleFavorite,
    onDetails,
    onMessage,
}) {
    const list = pets.filter((p) => favorites.includes(p.id));
    return (
        <main className="page-shell">
            <PageIntro
                eyebrow="Your account"
                title="Favorites"
                text="Animals saved to your account so you can find them again."
            />
            <div className="pets-grid">
                {list.map((p) => (
                    <article className="pet-card" key={p.id}>
                        <div
                            className="pet-photo"
                            style={{
                                backgroundImage: `url(${photoUrl(p.image, 720)})`,
                            }}
                        />
                        <div className="pet-info">
                            <h3>{p.name}</h3>
                            <p className="pet-meta">
                                {p.kind} · {p.breed} · {p.age}
                            </p>
                            <div className="pet-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => onDetails(p)}
                                >
                                    View details
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => toggleFavorite(p.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            {!list.length && (
                <EmptyState
                    title="No favorites saved"
                    text="Save animals from the Home or Adopt page to keep them here."
                />
            )}
        </main>
    );
}

export function ProfilePage({ user, onSave }) {
    const [form, setForm] = useState(user || {}),
        [photo, setPhoto] = useState(user?.photo || null);
    return (
        <main className="page-shell narrow-shell">
            <PageIntro
                eyebrow="Your account"
                title="Profile"
                text="Manage the personal information shown on your account."
            />
            <form
                className="content-panel report-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSave({ ...form, photo });
                }}
            >
                <div className="profile-photo">
                    <div>
                        {photo ? (
                            <img src={photo} alt="Profile" />
                        ) : (
                            (form.name || "S").slice(0, 1).toUpperCase()
                        )}
                    </div>
                    <PhotoUpload
                        value={photo}
                        onChange={setPhoto}
                        profilePicture
                    />
                </div>
                <div className="form-grid">
                    <Field label="Display name">
                        <input
                            value={form.name || ""}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                        />
                    </Field>
                    <Field label="Email address">
                        <input
                            type="email"
                            value={form.email || ""}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                        />
                    </Field>
                    <Field label="Contact number">
                        <input
                            value={form.phone || ""}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            placeholder="Phone number"
                            required
                        />
                    </Field>
                    <Field label="Address" wide>
                        <input
                            value={form.address || ""}
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                            placeholder="Street, barangay, city"
                            required
                        />
                    </Field>
                    <div className="span2">
                        <button className="btn btn-primary">
                            Save profile
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}

export function SettingsPage({ settings, onSave }) {
    const defaults = {
        emailUpdates: true,
        compactView: false,
        theme: "light",
        fontSize: "medium",
    };
    const [v, setV] = useState({ ...defaults, ...settings });
    useEffect(() => {
        onSave(v);
    }, [v]);
    return (
        <main className="page-shell narrow-shell settings-page">
            <PageIntro
                eyebrow="Your account"
                title="Settings"
                text="Personalize how PawRescue looks and reads. Changes save automatically."
            />
            <div className="content-panel settings-list">
                <label>
                    <span>
                        <b>Color mode</b>
                        <small>Choose a light or dark interface.</small>
                    </span>
                    <select
                        value={v.theme}
                        onChange={(e) => setV({ ...v, theme: e.target.value })}
                    >
                        <option value="light">Light mode</option>
                        <option value="dark">Dark mode</option>
                    </select>
                </label>
                <label>
                    <span>
                        <b>Font size</b>
                        <small>Adjust text size across pages.</small>
                    </span>
                    <select
                        value={v.fontSize}
                        onChange={(e) =>
                            setV({ ...v, fontSize: e.target.value })
                        }
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </label>
                <label>
                    <span>
                        <b>Email updates</b>
                        <small>
                            Receive account and report update notices.
                        </small>
                    </span>
                    <input
                        type="checkbox"
                        checked={v.emailUpdates}
                        onChange={(e) =>
                            setV({ ...v, emailUpdates: e.target.checked })
                        }
                    />
                </label>
                <label>
                    <span>
                        <b>Compact listings</b>
                        <small>Use a denser animal card layout.</small>
                    </span>
                    <input
                        type="checkbox"
                        checked={v.compactView}
                        onChange={(e) =>
                            setV({ ...v, compactView: e.target.checked })
                        }
                    />
                </label>
                <button
                    className="btn btn-ghost settings-reset"
                    onClick={() => setV(defaults)}
                >
                    Reset preferences
                </button>
                <p className="form-disclaimer">
                    Preferences are saved automatically in this browser.
                </p>
            </div>
        </main>
    );
}
export function MessagesPage({
    messages,
    onSend,
    orgId,
    selectOrg,
    session,
    orgs: allOrgs = organizations,
    users = [],
    hideIntro = false,
}) {
    const org = allOrgs.find((o) => o.id === orgId) || allOrgs[0],
        organizationRole = session?.role === "organization";
    const participants = [
        ...new Set(
            messages
                .filter(
                    (m) =>
                        m.orgId === org?.id &&
                        m.participantId &&
                        m.participantId !== session?.id,
                )
                .map((m) => m.participantId),
        ),
    ];
    const [activeParticipant, setActiveParticipant] = useState(
            participants[0] || "",
        ),
        [text, setText] = useState("");
    const activeId = activeParticipant || participants[0] || "",
        activeUser = users.find((u) => u.id === activeId);
    const threads = organizationRole
        ? participants.map((id) => ({
              id,
              user: users.find((u) => u.id === id),
              last: messages
                  .filter((m) => m.orgId === org?.id && m.participantId === id)
                  .at(-1),
          }))
        : allOrgs.map((o) => ({
              org: o,
              last: messages
                  .filter(
                      (m) =>
                          m.orgId === o.id &&
                          (m.participantId === session?.id ||
                              m.senderId === session?.id),
                  )
                  .at(-1),
          }));
    const currentMessages = messages.filter(
        (m) =>
            m.orgId === org?.id &&
            (organizationRole
                ? Boolean(activeId) && m.participantId === activeId
                : m.participantId === session?.id ||
                  m.senderId === session?.id),
    );
    return (
        <main className="page-shell">
            {!hideIntro && (
                <PageIntro
                    eyebrow="Private conversations"
                    title="Messages"
                    text="Conversations are visible only to their participants. Chat supports coordination, not emergency dispatch, and does not guarantee an immediate reply."
                />
            )}
            <div className="chat-layout">
                <aside className="chat-sidebar">
                    <h2>Conversations</h2>
                    {threads.map((t) => (
                        <button
                            className={`chat-person ${(organizationRole ? t.id === activeId : t.org.id === org?.id) ? "current" : ""}`}
                            key={organizationRole ? t.id : t.org.id}
                            onClick={() =>
                                organizationRole
                                    ? setActiveParticipant(t.id)
                                    : selectOrg(t.org.id)
                            }
                        >
                            <span className="chat-avatar">
                                {organizationRole
                                    ? (t.user?.name || "A").slice(0, 1)
                                    : t.org.icon}
                            </span>
                            <span>
                                <b>
                                    {organizationRole
                                        ? t.user?.name || "Adopter"
                                        : t.org.name}
                                </b>
                                <small>
                                    {t.last?.text || "Start a conversation"}
                                </small>
                                {t.last && <small>{t.last.time}</small>}
                            </span>
                        </button>
                    ))}
                </aside>
                <section className="chat-window">
                    <div className="chat-title">
                        <span className="chat-avatar">
                            {organizationRole
                                ? (activeUser?.name || "A").slice(0, 1)
                                : org?.icon}
                        </span>
                        <span>
                            <b>
                                {organizationRole
                                    ? activeUser?.name ||
                                      "Select a conversation"
                                    : org?.name}
                            </b>
                            <small>
                                {organizationRole
                                    ? "Private adopter conversation"
                                    : `${org?.category} · ${org?.place}`}
                            </small>
                        </span>
                    </div>
                    <div className="message-thread">
                        {currentMessages.map((m, i) => (
                            <div
                                className={
                                    m.senderId === session?.id
                                        ? "message-row mine"
                                        : "message-row"
                                }
                                key={m.id || i}
                            >
                                <div className="bubble">
                                    {m.text}
                                    <small>{m.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form
                        className="chat-compose"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (text.trim() && (!organizationRole || activeId))
                                onSend({
                                    orgId: org.id,
                                    text: text.trim(),
                                    senderId: session.id,
                                    participantId: organizationRole
                                        ? activeId
                                        : session.id,
                                });
                            setText("");
                        }}
                    >
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={
                                organizationRole
                                    ? "Reply to this conversation"
                                    : `Message ${org?.name}…`
                            }
                            disabled={organizationRole && !activeId}
                        />
                        <button
                            className="btn btn-primary"
                            disabled={
                                !text.trim() || (organizationRole && !activeId)
                            }
                        >
                            <Send size={16} /> Send
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export function AuthPage({
    onLogin,
    onRegister,
    onNavigate,
    initialMode = "login",
}) {
    const [mode, setMode] = useState(initialMode),
        [account, setAccount] = useState("user");
    if (mode === "register")
        return (
            <PartnerRegistration
                initialType={
                    account === "organization" ? "organization" : "resident"
                }
                onSubmit={onRegister}
                onSignIn={() => setMode("login")}
                onNavigate={onNavigate}
            />
        );
    const submit = (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        mode === "login"
            ? onLogin({
                  id: `${account}-demo`,
                  name: d.name || "Samira Santos",
                  email: d.email,
                  password: d.password,
                  phone: d.phone || "",
                  role: account,
                  orgId: account === "organization" ? "org-1" : undefined,
              })
            : onRegister({
                  ...d,
                  role: account,
                  orgId: account === "organization" ? "org-1" : undefined,
              });
    };
    return (
        <main className="auth-shell">
            <div className="auth-brand">
                <span className="brandmark">
                    <span>🐾</span>
                </span>
                <b>PawRescue</b>
            </div>
            <section className="auth-card">
                <div className="kicker">
                    {mode === "login" ? "Welcome back" : "Join the community"}
                </div>
                <h1>{mode === "login" ? "Log in" : "Create an account"}</h1>
                <p>Continue to your PawRescue workspace.</p>
                <div className="role-tabs">
                    <button
                        className={account === "user" ? "selected" : ""}
                        onClick={() => setAccount("user")}
                        type="button"
                    >
                        Resident
                    </button>
                    <button
                        className={account === "organization" ? "selected" : ""}
                        onClick={() => setAccount("organization")}
                        type="button"
                    >
                        Organization
                    </button>
                </div>
                <form onSubmit={submit} className="auth-form">
                    {mode === "register" && (
                        <Field label="Full name">
                            <input name="name" required />
                        </Field>
                    )}
                    <Field label="Email address">
                        <input
                            name="email"
                            type="email"
                            required
                            spellCheck={false}
                        />
                    </Field>
                    <Field label="Password">
                        <input
                            name="password"
                            type="password"
                            required
                            minLength="6"
                        />
                    </Field>
                    {mode === "register" && (
                        <>
                            <Field label="Contact number">
                                <input name="phone" required />
                            </Field>
                            <Field label="Address">
                                <input
                                    name="address"
                                    required
                                    placeholder="Street, barangay, city"
                                />
                            </Field>
                        </>
                    )}
                    <button className="btn btn-primary auth-submit">
                        {mode === "login" ? "Log in" : "Create account"}{" "}
                        <ArrowRight size={15} />
                    </button>
                </form>
                <p className="auth-switch">
                    {mode === "login"
                        ? "New to PawRescue?"
                        : "Already have an account?"}{" "}
                    <button
                        onClick={() =>
                            mode === "login"
                                ? onNavigate("Register")
                                : onNavigate("Log in")
                        }
                    >
                        {mode === "login" ? "Create account" : "Log in"}
                    </button>
                </p>
                <p className="demo-note">
                    Demo only: accounts and access roles are stored locally. No
                    authentication service is connected.
                </p>
                <button
                    className="text-link"
                    onClick={() => onNavigate("Home")}
                >
                    Back to Home
                </button>
            </section>
        </main>
    );
}

function PartnerRegistration({
    onSubmit,
    onSignIn,
    onNavigate,
    initialType = "resident",
}) {
    const [accountType, setAccountType] = useState(initialType);
    const organization = accountType === "organization";
    const submit = (e) => {
        e.preventDefault();
        const fields = Object.fromEntries(new FormData(e.currentTarget));
        onSubmit({
            ...fields,
            category: organization ? "Animal shelter" : undefined,
            services: "",
            role: organization ? "organization" : "user",
        });
    };
    return (
        <main className="partner-register-shell">
            <div className="partner-register-grid">
                <aside className="partner-info-panel">
                    <div className="partner-eyebrow">
                        {organization
                            ? "Organization onboarding"
                            : "Resident registration"}
                    </div>
                    <h1>
                        {organization
                            ? "Apply to join PawRescue as an organization"
                            : "Join PawRescue as a resident"}
                    </h1>
                    <p className="partner-lead">
                        {organization
                            ? "Submit your organization details and our admins will review your application before activating your partner account."
                            : "Create an account to report animals, contact local organizations, and send adoption inquiries."}
                    </p>
                    <div className="partner-info-card">
                        <span className="partner-info-icon">✓</span>
                        <div>
                            <b>
                                {organization
                                    ? "Admin-reviewed access"
                                    : "A community account"}
                            </b>
                            <p>
                                {organization
                                    ? "Organization applications are reviewed before workspace access is approved."
                                    : "Keep your reports, messages, and adoption inquiries together."}
                            </p>
                        </div>
                    </div>
                    <div className="partner-info-card">
                        <span className="partner-info-icon">♡</span>
                        <div>
                            <b>
                                {organization
                                    ? "Built for rescue teams"
                                    : "Find local support"}
                            </b>
                            <p>
                                {organization
                                    ? "Approved organizations get a dedicated workspace for reports, listings, inquiries, and messages."
                                    : "Browse available animals and connect with participating organizations."}
                            </p>
                        </div>
                    </div>
                    <div className="partner-steps">
                        <h2>What happens next</h2>
                        <ol>
                            {organization ? (
                                <>
                                    <li>
                                        <span>1</span>Submit your organization
                                        details.
                                    </li>
                                    <li>
                                        <span>2</span>Our admin team reviews the
                                        application.
                                    </li>
                                    <li>
                                        <span>3</span>After approval, sign in
                                        with your email and password.
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <span>1</span>Enter your contact
                                        details.
                                    </li>
                                    <li>
                                        <span>2</span>Create your resident
                                        account.
                                    </li>
                                    <li>
                                        <span>3</span>Browse, report, and
                                        connect with local shelters.
                                    </li>
                                </>
                            )}
                        </ol>
                    </div>
                </aside>
                <section className="partner-application-card">
                    <div className="partner-application-heading">
                        <div className="kicker">
                            {organization
                                ? "Organization registration"
                                : "Resident registration"}
                        </div>
                        <h2>
                            {organization
                                ? "Tell us about your organization"
                                : "Create your resident account"}
                        </h2>
                        <p>
                            {organization
                                ? "Fill in the information below so we can review your organization."
                                : "Add your contact details to get started with PawRescue."}
                        </p>
                    </div>
                    <form className="partner-form" onSubmit={submit}>
                        <div className="partner-type-field">
                            <span>Account type</span>
                            <div className="partner-type-toggle">
                                <button
                                    type="button"
                                    className={organization ? "selected" : ""}
                                    onClick={() =>
                                        setAccountType("organization")
                                    }
                                >
                                    Organization
                                </button>
                                <button
                                    type="button"
                                    className={!organization ? "selected" : ""}
                                    onClick={() => setAccountType("resident")}
                                >
                                    Resident
                                </button>
                            </div>
                        </div>
                        <div className="form-grid">
                            {organization ? (
                                <>
                                    <Field label="Organization name">
                                        <input
                                            name="name"
                                            required
                                            placeholder="Your organization name"
                                        />
                                    </Field>
                                    <Field label="Contact person">
                                        <input
                                            name="representative"
                                            required
                                            placeholder="Full name"
                                        />
                                    </Field>
                                    <Field label="Contact email">
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            spellCheck={false}
                                            placeholder="you@example.com"
                                        />
                                    </Field>
                                    <Field label="Contact number">
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="+63 917 000 0000"
                                        />
                                    </Field>
                                    <Field label="Address" wide>
                                        <input
                                            name="address"
                                            required
                                            placeholder="Street, barangay, building, or office address"
                                        />
                                    </Field>
                                    <Field label="Province or region">
                                        <input
                                            name="region"
                                            required
                                            placeholder="Province or region"
                                        />
                                    </Field>
                                    <Field label="City">
                                        <input
                                            name="city"
                                            required
                                            placeholder="City or municipality"
                                        />
                                    </Field>
                                    <Field label="Create password">
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            minLength="6"
                                            placeholder="At least 6 characters"
                                        />
                                    </Field>
                                    <Field label="Additional notes" wide>
                                        <textarea
                                            name="description"
                                            rows="3"
                                            placeholder="Tell us about your services or operating area."
                                        />
                                    </Field>
                                </>
                            ) : (
                                <>
                                    <Field label="Full name">
                                        <input
                                            name="name"
                                            required
                                            placeholder="Your full name"
                                        />
                                    </Field>
                                    <Field label="Email address">
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            spellCheck={false}
                                            placeholder="you@example.com"
                                        />
                                    </Field>
                                    <Field label="Contact number">
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="+63 917 000 0000"
                                        />
                                    </Field>
                                    <Field label="Address">
                                        <input
                                            name="address"
                                            required
                                            placeholder="Street, barangay, city"
                                        />
                                    </Field>
                                    <Field label="Create password" wide>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            minLength="6"
                                            placeholder="At least 6 characters"
                                        />
                                    </Field>
                                </>
                            )}
                            <button className="btn btn-primary partner-submit span2">
                                {organization
                                    ? "Submit application"
                                    : "Create resident account"}{" "}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>
                    <div className="partner-application-footer">
                        <span>Already have an account?</span>
                        <button onClick={onSignIn}>Sign in here</button>
                    </div>
                    <button
                        className="text-link partner-back"
                        onClick={() => onNavigate("Home")}
                    >
                        Back to PawRescue
                    </button>
                </section>
            </div>
        </main>
    );
}

export function ReportDetail({ report, submitter, assignedOrganization }) {
    return (
        <div className="modal-copy report-detail-modal">
            <div className="kicker">Community report · {report.id}</div>
            <h2>
                {report.kind}: {report.animalType}
                {report.breed ? ` · ${report.breed}` : ""}
            </h2>
            <p>
                Submitted by {submitter?.name || "Resident"} · {report.date}
            </p>
            {(report.image || report.photo) && (
                <img
                    className="report-photo"
                    src={report.image || report.photo}
                    alt="Animal included in the report"
                />
            )}
            <dl className="detail-list">
                <dt>Animal</dt>
                <dd>
                    {report.animalType} · {report.breed || "Unknown breed"}
                </dd>
                <dt>Observed condition</dt>
                <dd>{report.condition || "Not specified"}</dd>
                <dt>Description</dt>
                <dd>
                    {report.description ||
                        "No additional description provided."}
                </dd>
                <dt>Address</dt>
                <dd>{report.place}</dd>
                <dt>Confirmed coordinates</dt>
                <dd>
                    {report.lat ?? "Not recorded"},{" "}
                    {report.lng ?? "Not recorded"}
                </dd>
                <dt>Assigned organization</dt>
                <dd>{assignedOrganization || "Available for organizations"}</dd>
                <dt>Recorded status</dt>
                <dd>
                    <StatusBadge status={report.status} />
                </dd>
                <dt>Publication review</dt>
                <dd>
                    <StatusBadge status={report.approvalStatus || "Pending"} />
                </dd>
                <dt>Contact from submitter</dt>
                <dd>
                    {submitter?.email || "Not provided"}
                    {submitter?.phone ? ` · ${submitter.phone}` : ""}
                </dd>
            </dl>
            <p className="form-disclaimer">
                This is the status recorded by an authorized account. It does
                not independently confirm physical rescue operations.
            </p>
        </div>
    );
}
