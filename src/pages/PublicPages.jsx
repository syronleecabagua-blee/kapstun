import { useMemo, useState } from "react";
import { ArrowRight, MapPin, SlidersHorizontal } from "lucide-react";
import {
    AnimalCard,
    EmptyState,
    OrganizationCard,
    PageIntro,
    SearchBox,
    StatusBadge,
} from "../components/Controls";
import { initialPets, organizations, photoUrl } from "../data";

function reportPhoto(report, width = 900) {
    const photo = report.photo || report.image;
    if (photo) {
        return photo.startsWith("data:") ||
            photo.startsWith("http://") ||
            photo.startsWith("https://")
            ? photo
            : photoUrl(photo, width);
    }
    return photoUrl(
        report.animalType?.toLowerCase() === "cat"
            ? "photo-1495360010541-f48722b34f7d"
            : "photo-1516734212186-a967f81ad0d7",
        width,
    );
}

function wasReportAccepted(report) {
    return (
        report.assignmentStatus === "Accepted" ||
        ["Responding", "Rescued", "Completed"].includes(report.status)
    );
}

function rescuedDate(report) {
    if (!report.rescuedAt) return "Date not recorded";
    const date = new Date(report.rescuedAt);
    return Number.isNaN(date.getTime())
        ? "Date not recorded"
        : date.toLocaleString();
}

export function HomePage({
    pets,
    orgs = organizations,
    reports = [],
    announcements = [],
    favorites,
    toggleFavorite,
    onDetails,
    onReportDetails,
    onMessage,
    onAdopt,
    onNavigate,
    onOrg,
}) {
    const shown = pets.filter((p) => p.status === "Available");
    return (
        <>
            <section className="hero">
                <div className="hero-card">
                    <div className="hero-image" />
                    <div className="hero-content">
                        <div className="eyebrow">A community that cares</div>
                        <h1>
                            Every paw deserves a <i>safe place.</i>
                        </h1>
                        <p>
                            Help a stray find care, a lost friend find home, or
                            a hopeful pet find their person. Small acts of
                            kindness start right here.
                        </p>
                        <div className="hero-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => onNavigate("Report an animal")}
                            >
                                ＋ Report an animal
                            </button>
                            <button
                                className="btn btn-light"
                                onClick={() =>
                                    document
                                        .getElementById("available-pets")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                Meet the animals <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="trustbar">
                            <span>✓ Share a sighting</span>
                            <span>✓ Find local shelters</span>
                            <span>✓ Adopt with care</span>
                        </div>
                    </div>
                </div>
            </section>
            {announcements.length > 0 && (
                <section className="section announcement-list">
                    <div className="section-head">
                        <div>
                            <div className="kicker">Platform announcements</div>
                            <h2>Latest updates</h2>
                        </div>
                    </div>
                    {announcements.slice(0, 3).map((item) => (
                        <article
                            className="content-panel announcement-card"
                            key={item.id}
                        >
                            <div className="kicker">{item.date}</div>
                            <h3>{item.title}</h3>
                            <p>{item.body}</p>
                        </article>
                    ))}
                </section>
            )}{" "}
            <section className="section" id="available-pets">
                <div className="section-head">
                    <div>
                        <div className="kicker">Looking for a home</div>
                        <h2>Available animals</h2>
                        <p>
                            Browse every listing from our participating
                            organizations.
                        </p>
                    </div>
                    <button
                        className="text-link"
                        onClick={() => onNavigate("Adopt")}
                    >
                        Browse All <ArrowRight size={15} />
                    </button>
                </div>
                <div className="pets-grid">
                    {shown.slice(0, 6).map((p) => (
                        <AnimalCard
                            key={p.id}
                            animal={p}
                            favorite={favorites.includes(p.id)}
                            onFavorite={toggleFavorite}
                            onDetails={onDetails}
                            onMessage={onMessage}
                            onAdopt={onAdopt}
                            orgs={orgs}
                        />
                    ))}
                </div>
                {!shown.length && (
                    <EmptyState
                        title="No animals match those filters"
                        text="Try another search, animal type, or organization."
                    />
                )}
            </section>
            <section className="section">
                <div className="section-head">
                    <div>
                        <div className="kicker">Around your community</div>
                        <h2>People helping paws</h2>
                        <p>Learn about local shelters and rescue groups.</p>
                    </div>
                    <button
                        className="text-link"
                        onClick={() => onNavigate("Shelter Directory")}
                    >
                        Open shelter directory <ArrowRight size={15} />
                    </button>
                </div>
                <div className="org-grid">
                    {orgs.slice(0, 3).map((o) => (
                        <OrganizationCard
                            key={o.id}
                            organization={o}
                            onView={onOrg}
                            onAnimals={(x) => onNavigate("Adopt", x.id)}
                            onMessage={onMessage}
                        />
                    ))}
                </div>
            </section>
            {reports.some((report) => report.publicDisplay) && (
                <section className="section">
                    <div className="section-head">
                        <div>
                            <div className="kicker">Organization updates</div>
                            <h2>Community animal reports</h2>
                            <p>
                                Reports approved for public display by PawRescue
                                administrators.
                            </p>
                        </div>
                    </div>
                    <div className="home-report-grid">
                        {reports
                            .filter((report) => report.publicDisplay)
                            .slice(0, 4)
                            .map((report) => {
                                const assignedOrganization = orgs.find(
                                    (organization) =>
                                        organization.id === report.orgId,
                                );
                                const hasPhoto = Boolean(
                                    report.photo || report.image,
                                );

                                return (
                                    <article
                                        className="content-panel home-report-card"
                                        key={report.id}
                                    >
                                        <div className="home-report-image-wrap">
                                            <img
                                                src={reportPhoto(report)}
                                                alt={
                                                    hasPhoto
                                                        ? `Animal in ${report.kind.toLowerCase()} report`
                                                        : `Representative ${report.animalType.toLowerCase()} photo`
                                                }
                                            />
                                            {!hasPhoto && (
                                                <span>Representative image</span>
                                            )}
                                        </div>
                                        <div className="home-report-card-body">
                                            <div className="home-report-card-head">
                                                <span className="kicker">
                                                    {report.id} · {report.kind}
                                                </span>
                                                <StatusBadge
                                                    status={report.status}
                                                />
                                            </div>
                                            <h3>
                                                {report.animalType}
                                                {report.breed
                                                    ? ` · ${report.breed}`
                                                    : ""}
                                            </h3>
                                            <p>{report.description}</p>
                                            <dl>
                                                <dt>Location</dt>
                                                <dd>{report.place}</dd>
                                                <dt>Condition</dt>
                                                <dd>{report.condition}</dd>
                                                {wasReportAccepted(report) && (
                                                    <>
                                                        <dt>Taken by</dt>
                                                        <dd>
                                                            {assignedOrganization?.name ||
                                                                "Organization not listed"}
                                                        </dd>
                                                    </>
                                                )}
                                                {report.status === "Rescued" && (
                                                    <>
                                                        <dt>Rescued update</dt>
                                                        <dd>
                                                            {rescuedDate(report)}
                                                        </dd>
                                                    </>
                                                )}
                                            </dl>
                                            <button
                                                className="btn btn-ghost"
                                                onClick={() =>
                                                    onReportDetails?.(report)
                                                }
                                            >
                                                View report details
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                    </div>
                    <p className="form-disclaimer">
                        Statuses are recorded by PawRescue accounts and do not
                        independently verify physical rescue, treatment, or
                        transport.
                    </p>
                </section>
            )}
            <section className="bottom-cta">
                <div>
                    <span className="kicker">Your community needs you</span>
                    <h2>See an animal that needs help?</h2>
                    <p>
                        Share the details so a nearby organization can review
                        them.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => onNavigate("Report an animal")}
                >
                    Create a report <ArrowRight size={15} />
                </button>
            </section>
        </>
    );
}

export function AdoptPage({
    pets,
    orgs = organizations,
    favorites,
    toggleFavorite,
    onDetails,
    onMessage,
    onAdopt,
    initialOrg,
}) {
    const [page, setPage] = useState(1),
        [filters, setFilters] = useState({
            kind: "All",
            breed: "All",
            size: "All",
            region: "All",
            location: "All",
            status: "Available",
            org: initialOrg || "all",
        });
    const change = (key, value) => {
        setFilters((v) => ({ ...v, [key]: value }));
        setPage(1);
    };
    const regions = [
            ...new Set(
                pets
                    .map((p) => p.place?.split(",").at(-1)?.trim())
                    .filter(Boolean),
            ),
        ].sort(),
        locations = [
            ...new Set(
                pets
                    .filter(
                        (p) =>
                            filters.region === "All" ||
                            p.place?.includes(filters.region),
                    )
                    .map((p) => p.place?.split(",")[0]?.trim())
                    .filter(Boolean),
            ),
        ].sort();
    const list = useMemo(
        () =>
            pets.filter(
                (p) =>
                    (filters.kind === "All" || p.kind === filters.kind) &&
                    (filters.breed === "All" || p.breed === filters.breed) &&
                    (filters.size === "All" ||
                        (p.size || (p.kind === "Cat" ? "Small" : "Medium")) ===
                            filters.size) &&
                    (filters.region === "All" ||
                        p.place?.includes(filters.region)) &&
                    (filters.location === "All" ||
                        p.place?.startsWith(filters.location)) &&
                    (filters.status === "All" || p.status === filters.status) &&
                    (filters.org === "all" || p.orgId === filters.org),
            ),
        [pets, filters],
    );
    const pageSize = 25,
        pageCount = Math.max(1, Math.ceil(list.length / pageSize)),
        pageItems = list.slice((page - 1) * pageSize, page * pageSize);
    return (
        <main className="page-shell">
            <PageIntro
                eyebrow="Find your new best friend"
                title="Animals looking for a home"
                text="Browse available animals from participating shelters and rescue groups. Availability can change, so confirm details with the organization."
            />
            <div className="adopt-layout">
                <aside className="filter-panel" id="adopt-filters">
                    <div className="filter-heading">
                        <span className="filter-heading-icon">
                            <SlidersHorizontal size={17} />
                        </span>
                        <div>
                            <b>Filter pets</b>
                            <small>Quick, compact filters.</small>
                        </div>
                    </div>
                    <div className="filter-group">
                        <b className="filter-label">Species</b>
                        <div className="species-options">
                            {[
                                ["All", "All pets"],
                                ["Dog", "Dogs"],
                                ["Cat", "Cats"],
                            ].map(([value, label]) => (
                                <button
                                    type="button"
                                    key={value}
                                    className={
                                        filters.kind === value ? "selected" : ""
                                    }
                                    onClick={() => change("kind", value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <label className="filter-group">
                        <b className="filter-label">Breed</b>
                        <select
                            className="filter-select-compact"
                            value={filters.breed}
                            onChange={(e) => change("breed", e.target.value)}
                        >
                            <option value="All">All breeds</option>
                            {[
                                ...new Set(
                                    pets.map((p) => p.breed).filter(Boolean),
                                ),
                            ]
                                .sort()
                                .map((breed) => (
                                    <option key={breed}>{breed}</option>
                                ))}
                        </select>
                    </label>
                    <div className="filter-group">
                        <b className="filter-label">Size</b>
                        <div className="size-options">
                            {[
                                ["All", "All sizes"],
                                ["Small", "Small"],
                                ["Medium", "Medium"],
                                ["Large", "Large"],
                            ].map(([value, label]) => (
                                <button
                                    type="button"
                                    key={value}
                                    className={
                                        filters.size === value ? "selected" : ""
                                    }
                                    onClick={() => change("size", value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-group">
                        <b className="filter-label">Location</b>
                        <select
                            className="filter-select-compact"
                            value={filters.region}
                            onChange={(e) => {
                                setFilters((v) => ({
                                    ...v,
                                    region: e.target.value,
                                    location: "All",
                                }));
                                setPage(1);
                            }}
                        >
                            <option value="All">
                                All provinces or regions
                            </option>
                            {regions.map((region) => (
                                <option key={region}>{region}</option>
                            ))}
                        </select>
                        <select
                            className="filter-select-compact"
                            value={filters.location}
                            disabled={filters.region === "All"}
                            onChange={(e) => change("location", e.target.value)}
                        >
                            <option value="All">
                                {filters.region === "All"
                                    ? "Select a province first"
                                    : "All cities or municipalities"}
                            </option>
                            {locations.map((location) => (
                                <option key={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="reset-filters"
                        onClick={() => {
                            setFilters({
                                kind: "All",
                                breed: "All",
                                size: "All",
                                region: "All",
                                location: "All",
                                status: "Available",
                                org: initialOrg || "all",
                            });
                            setPage(1);
                        }}
                    >
                        Reset filters
                    </button>
                </aside>
                <div className="adopt-results">
                    <div className="result-count">
                        {list.length} animals match your search · page {page} of{" "}
                        {pageCount}
                    </div>
                    {pageItems.length ? (
                        <div className="pets-grid">
                            {pageItems.map((p) => (
                                <AnimalCard
                                    key={p.id}
                                    animal={p}
                                    favorite={favorites.includes(p.id)}
                                    toggleFavorite={toggleFavorite}
                                    onFavorite={toggleFavorite}
                                    onDetails={onDetails}
                                    onMessage={onMessage}
                                    onAdopt={onAdopt}
                                    orgs={orgs}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No animals match those filters"
                            text="Try changing your search or filters."
                        />
                    )}
                    <div className="pagination">
                        <button
                            className="btn btn-ghost"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {pageCount} · up to 25 animals per
                            page
                        </span>
                        <button
                            className="btn btn-ghost"
                            disabled={page === pageCount}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
export function DirectoryPage({
    orgs = organizations,
    onView,
    onAnimals,
    onMessage,
}) {
    return (
        <main className="page-shell">
            <PageIntro
                eyebrow="Local support"
                title="Shelter Directory"
                text="Connect with participating shelters, rescue organizations, centers, and public services."
            />
            <div className="directory-intro">
                <div className="directory-map">
                    <DirectoryMap />
                    <div className="map-caption">
                        <MapPin size={17} />
                        <div>
                            <b>Iloilo City & nearby areas</b>
                            <small>
                                Locations supplied by participating
                                organizations
                            </small>
                        </div>
                    </div>
                </div>
                <div className="directory-list">
                    {orgs.map((o) => (
                        <OrganizationCard
                            key={o.id}
                            organization={o}
                            onView={onView}
                            onAnimals={onAnimals}
                            onMessage={onMessage}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
export function PublicReportsPage({
    reports = [],
    orgs = organizations,
    onReport,
    onView,
}) {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({
        kind: "All",
        animal: "All",
        status: "All",
    });
    const approved = reports.filter(
        (report) => report.approvalStatus === "Approved" && report.publicDisplay,
    );
    const kinds = [...new Set(approved.map((report) => report.kind))].sort();
    const animals = [...new Set(approved.map((report) => report.animalType))].sort();
    const statuses = [...new Set(approved.map((report) => report.status))].sort();
    const filtered = approved.filter((report) => {
        const matchesSearch = `${report.kind} ${report.animalType} ${report.breed} ${report.place}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
            matchesSearch &&
            (filters.kind === "All" || report.kind === filters.kind) &&
            (filters.animal === "All" || report.animalType === filters.animal) &&
            (filters.status === "All" || report.status === filters.status)
        );
    });
    return (
        <main className="page-shell">
            <PageIntro
                eyebrow="Community updates"
                title="Public Animal Reports"
                text="View animal-related cases approved for public display by PawRescue administrators."
                action={
                    <div className="public-report-actions">
                        <SearchBox
                            value={query}
                            onChange={setQuery}
                            placeholder="Search report type, animal, or location…"
                        />
                        <button className="btn btn-primary" onClick={onReport}>
                            ＋ Report an animal
                        </button>
                    </div>
                }
            />
            <div className="public-report-filters">
                <label>
                    <span>Report type</span>
                    <select
                        value={filters.kind}
                        onChange={(event) =>
                            setFilters({ ...filters, kind: event.target.value })
                        }
                    >
                        <option value="All">All report types</option>
                        {kinds.map((kind) => (
                            <option key={kind} value={kind}>
                                {kind}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Animal</span>
                    <select
                        value={filters.animal}
                        onChange={(event) =>
                            setFilters({ ...filters, animal: event.target.value })
                        }
                    >
                        <option value="All">All animals</option>
                        {animals.map((animal) => (
                            <option key={animal} value={animal}>
                                {animal}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Status</span>
                    <select
                        value={filters.status}
                        onChange={(event) =>
                            setFilters({ ...filters, status: event.target.value })
                        }
                    >
                        <option value="All">All statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    className="btn btn-ghost public-report-reset"
                    onClick={() => {
                        setQuery("");
                        setFilters({ kind: "All", animal: "All", status: "All" });
                    }}
                >
                    Reset filters
                </button>
            </div>
            {filtered.length ? (
                <div className="public-cases">
                    {filtered.map((report) => {
                        const uploadedPhoto = report.photo || report.image;
                        const assignedOrganization = orgs.find(
                            (organization) => organization.id === report.orgId,
                        );
                        const takenByOrganization = wasReportAccepted(report);

                        return (
                            <article
                                className="content-panel public-case"
                                key={report.id}
                            >
                                <div className="public-case-head">
                                    <div>
                                        <span className="kicker">
                                            {report.id} · {report.kind}
                                        </span>
                                        <h2>
                                            {report.animalType}
                                            {report.breed
                                                ? ` · ${report.breed}`
                                                : ""}
                                        </h2>
                                    </div>
                                    <StatusBadge status={report.status} />
                                </div>
                                <p>{report.description}</p>
                                <div className="public-report-image-wrap">
                                    <img
                                        className="public-report-photo"
                                        src={reportPhoto(report)}
                                        alt={
                                            uploadedPhoto
                                                ? `Animal in ${report.kind.toLowerCase()} report`
                                                : `Representative ${report.animalType.toLowerCase()} photo; no report photo was submitted`
                                        }
                                    />
                                    {!uploadedPhoto && (
                                        <span className="public-report-image-note">
                                            Representative image
                                        </span>
                                    )}
                                </div>
                                <dl>
                                    <dt>Location</dt>
                                    <dd>{report.place}</dd>
                                    <dt>Condition</dt>
                                    <dd>{report.condition}</dd>
                                    <dt>Reported</dt>
                                    <dd>{report.date}</dd>
                                    {takenByOrganization && (
                                        <>
                                            <dt>Taken by</dt>
                                            <dd>
                                                {assignedOrganization?.name ||
                                                    "Organization not listed"}
                                            </dd>
                                        </>
                                    )}
                                    {report.status === "Rescued" && (
                                        <>
                                            <dt>Rescued update</dt>
                                            <dd>{rescuedDate(report)}</dd>
                                        </>
                                    )}
                                </dl>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => onView(report)}
                                >
                                    View Details
                                </button>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    title={
                        approved.length
                            ? "No reports match these filters"
                            : "No approved reports found"
                    }
                    text={
                        approved.length
                            ? "Try another search or reset the filters."
                            : "Approved public animal reports will appear here."
                    }
                />
            )}
            <p className="form-disclaimer">
                Statuses are recorded by PawRescue accounts and do not
                independently verify physical rescue, treatment, or transport.
            </p>
        </main>
    );
}
export function DirectoryMap() {
    return (
        <div className="mapbox">
            <span className="map-label label-one">Jaro</span>
            <span className="map-label label-two">Iloilo River</span>
            {[25, 63, 45, 76].map((left, i) => (
                <MapPin
                    key={i}
                    className="directory-pin"
                    style={{ left: `${left}%`, top: `${25 + i * 14}%` }}
                    size={22}
                />
            ))}
            <div className="map-attribution">Iloilo City · Panay Island</div>
        </div>
    );
}

export function AboutPage() {
    return (
        <main className="page-shell about-page">
            <PageIntro
                eyebrow="About PawRescue"
                title="A community that helps animals find care"
                text="PawRescue brings residents and local organizations together to report animals in need, share trusted updates, and help adoptable animals find a home."
            />
            <div className="about-feature">
                <img
                    src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=85"
                    alt="A rescued dog sitting with a caregiver"
                />
                <div className="content-panel">
                    <div className="kicker">How PawRescue works</div>
                    <h2>One place to help, connect, and adopt</h2>
                    <p>
                        Residents can share a sighting with its location and
                        follow status updates recorded by participating
                        organizations. Shelters can review available reports,
                        coordinate responses, and keep their adoption listings
                        up to date.
                    </p>
                    <p>
                        Browse organization profiles to find contact details,
                        services, and available animals. Send an inquiry to
                        learn about an animal and the organization’s adoption
                        process.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            document
                                .getElementById("about-actions")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Explore ways to help <ArrowRight size={15} />
                    </button>
                </div>
            </div>
            <section className="about-actions-section" id="about-actions">
                <div className="section-head">
                    <div>
                        <div className="kicker">Get involved</div>
                        <h2>Small steps make a difference</h2>
                        <p>Choose a simple way to support animals in your community.</p>
                    </div>
                </div>
                <div className="feature-row">
                    <article className="feature">
                        <div className="feature-icon">📍</div>
                        <div>
                            <h3>Share a report</h3>
                            <p>
                                Add a clear description and location so nearby
                                organizations can review what happened.
                            </p>
                        </div>
                    </article>
                    <article className="feature">
                        <div className="feature-icon">🏠</div>
                        <div>
                            <h3>Connect with a shelter</h3>
                            <p>
                                Browse organization details, services, and
                                contact information in the directory.
                            </p>
                        </div>
                    </article>
                    <article className="feature">
                        <div className="feature-icon">♡</div>
                        <div>
                            <h3>Adopt thoughtfully</h3>
                            <p>
                                Read each animal’s information and contact the
                                organization about its adoption process.
                            </p>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}
