export function formatDuration(seconds: number) {
    const hours = Number((Math.floor(seconds / 3600)).toFixed(0))
    const minutes = Number(Math.floor((seconds - hours * 3600) / 60).toFixed(0))
    const remainingSeconds = Number((seconds - hours * 3600 - minutes * 60).toFixed(0))

    return (
        (hours > 0 ? hours + ":" : "") +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds)
    )
}