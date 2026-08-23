# Resolve a Git tag or commit SHA into a filesystem-safe release version string.

function Resolve-ReleaseVersion {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Tag
    )

    if ($Tag.StartsWith('v')) {
        $Tag = $Tag.Substring(1)
    }
    if ($Tag -match '^[0-9a-f]{40}$') {
        $Tag = $Tag.Substring(0, 7)
    }
    return $Tag
}
