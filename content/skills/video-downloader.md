---
title: "Video Downloader"
description: "Download YouTube videos with customizable quality and format options. Supports various quality settings, multiple formats, and audio-only downloads as MP3."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/video-downloader"
categories: ["development"]
tags: ["youtube", "video", "download", "mp4", "mp3"]
date: "2026-03-19T07:10:12Z"
---

<Callout type="tip">
Who this is for: Content creators, researchers, and anyone who needs to download YouTube videos for offline viewing, editing, or archival purposes with control over quality and format.
</Callout>

## What This Skill Does

Download YouTube videos with full control over quality and format settings using yt-dlp.

<Card title="Core Capabilities">

- **Quality Settings** — Download in best, 1080p, 720p, 480p, 360p, or worst quality
- **Format Options** — Output as MP4 (default), WebM, or MKV
- **Audio Only** — Extract and download audio as MP3
- **Custom Output** — Specify custom output directories
- **Auto-Install** — Automatically installs yt-dlp if not present
- **Smart Filename** — Generates filenames from video titles

</Card>

## Usage

### Basic Download

```
Download this YouTube video: https://www.youtube.com/watch?v=VIDEO_ID
```

```
Grab this video in best quality
```

### Quality Settings

```
Download this video in 1080p
```

```
Get this video in 720p to save space
```

### Audio Only

```
Download just the audio from this video as MP3
```

### Format Options

```
Download this video as WebM format
```

### Example Output

**User**: "Download this video in 1080p"

**Output**:
```markdown
Downloading: https://www.youtube.com/watch?v=dQw4w9WgXcQ

Video info:
- Title: Example Video Title
- Duration: 3:32
- Quality: 1080p
- Format: MP4

Processing...
✓ Video downloaded
✓ Audio merged
✓ File saved: /mnt/user-data/outputs/example-video.mp4

File size: 45.2 MB
```

## Options Reference

| Option | Flag | Values |
|--------|------|--------|
| Quality | `-q` | best, 1080p, 720p, 480p, 360p, worst |
| Format | `-f` | mp4, webm, mkv |
| Audio Only | `-a` | (downloads MP3) |
| Output Dir | `-o` | /custom/path |

## Complete Examples

### Download in 1080p as MP4
```
Download https://www.youtube.com/watch?v=VIDEO_ID in 1080p
```

### Download Audio Only as MP3
```
Extract audio from https://www.youtube.com/watch?v=VIDEO_ID as MP3
```

### Download in 720p as WebM to Custom Directory
```
Download this video in 720p as WebM to /custom/path
```

## Tips

- Downloads saved to `/mnt/user-data/outputs/` by default
- Higher quality = larger file size and longer download time
- Audio-only downloads are much smaller and faster
- Script handles yt-dlp installation automatically
- Filenames automatically generated from video titles

## Common Use Cases

| Use Case | Recommended Settings |
|----------|---------------------|
| **Offline Viewing** | 720p or 1080p MP4 |
| **Presentations** | 1080p MP4 (best compatibility) |
| **Video Editing** | Best quality, original format |
| **Podcast/Music** | Audio-only MP3 |
| **Archival** | Best quality available |
| **Mobile Viewing** | 480p or 720p (smaller files) |

## Related Use Cases

- Downloading tutorial videos for offline learning
- Saving conference talks for later reference
- Extracting audio from interviews or podcasts
- Archiving important content before removal
- Preparing videos for editing or repurposing
