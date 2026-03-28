import { useState } from "react";

export default function AddProject() {
    const [projectName, setProjectName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectName || !repoUrl) {
            alert("All fields are required!");
            return;
        }

        if (!repoUrl.includes("github.com")) {
            alert("Please enter a valid GitHub repo link");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/import-repo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectName, repoUrl })
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ Project uploaded successfully!");
                setProjectName("");
                setRepoUrl("");
            } else {
                alert(data.error || "❌ Something went wrong");
            }

        } catch (error) {
            console.error(error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 shadow-lg rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Add Your Project</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="url"
                    placeholder="GitHub Repo URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white p-2 rounded"
                >
                    {loading ? "Uploading..." : "Submit"}
                </button>

            </form>
        </div>
    );
}