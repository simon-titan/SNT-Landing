export function isUrlMatchingPattern(url, patterns) {
    const patternList = patterns.split(",").map((p) => p.trim());
    return patternList.some((pattern) => {
        // Convert the glob pattern to a regex pattern
        const regexPattern = pattern
            .replace(/\*\*/g, ".*") // Replace ** with .*
            .replace(/\*/g, "[^/]*") // Replace single * with [^/]*
            .replace(/\//g, "\\/"); // Escape forward slashes
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(url);
    });
}
