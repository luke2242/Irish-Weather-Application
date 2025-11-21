function Updates() {

    return (
        <>
            <div className="container-sm">
                <h1>Updates</h1>
                <p>This page tracks recent changes, fixes, and releases for the app.</p>
            </div>
            <br />
            <div className="container-sm">
                <h2>Recent Release</h2>
                <h3>21 Nov 2025</h3>
                <p>
                    This release makes the Irish Weather Application free to use — API keys are no longer required.
                </p>
                <h4>Chnages and Fixes</h4>
                <ul>
                    <li>Switched geocoding API to OpenMeteo.</li>
                    <li>Simplified the UI as a foundation for upcoming redesigns.</li>
                    <li>Reorganized the project structure for easier navigation and maintenance.</li>
                    <li>The Radars page is temporarily under construction while a new radar data source is evaluated.</li>
                    <li>Added this Updates page to document progress and inform users of changes.</li>
                </ul>
            </div>
        </>
    )
}

export default Updates;