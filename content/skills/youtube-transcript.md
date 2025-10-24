---
title: YouTube Transcript Downloader
slug: youtube-transcript
description: Downloads and processes YouTube transcripts for readability, with automatic deduplication and fallback to Whisper transcription for videos without subtitles.
categories:
  - productivity
  - content
tags:
  - youtube
  - transcription
  - video
  - content-extraction
featured: false
author: michalparkola
repoUrl: https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/youtube-transcript
externalUrl: https://github.com/michalparkola
date: 2025-10-24
version: 1.0.0
---

# YouTube Transcript Downloader

Extract clean, readable transcripts from YouTube videos in seconds. Perfect for studying tutorials, converting talks into notes, or creating written content from video sources.

<Callout type="tip">
Essential for learners, researchers, and content creators who want to reference video content in text form without manual transcription.
</Callout>

## Core Functionality

**Two-mode operation:**

1. **Subtitle Download** (fast) - Grabs existing captions
2. **Whisper Transcription** (slow but comprehensive) - Generates transcript from audio

**Automatic deduplication** removes the repetitive lines common in VTT subtitle formatting.

## How It Works

<Card title="Intelligent Fallback System">

**Primary Method:**
- Downloads official subtitles via `yt-dlp`
- Checks for multiple language options
- Preserves timing and structure
- Lightning fast (seconds)

**Fallback Method:**
- Downloads audio with `yt-dlp`
- Transcribes with OpenAI Whisper
- Works on any video (even without captions)
- Slower (minutes depending on video length)

**Post-Processing:**
- Removes duplicate lines from VTT format
- Cleans up formatting artifacts
- Creates readable paragraph structure
- Names file using video title

</Card>

## Usage Examples

**Basic download:**
```
Download the transcript for https://youtube.com/watch?v=dQw4w9WgXcQ
```

**Specify language:**
```
Get the Spanish transcript from this video: [URL]
```

**Batch processing:**
```
Download transcripts for these tutorial videos:
- https://youtube.com/watch?v=tutorial1
- https://youtube.com/watch?v=tutorial2
- https://youtube.com/watch?v=tutorial3
```

## Output Format

**Generated filename:** `[Video Title] - Transcript.txt`

**Content structure:**
```
[Clean paragraph-style transcript with duplicate lines removed]

Natural reading flow without VTT timestamp artifacts.
Preserves sentence structure and logical breaks.
```

## Installation

**Required (core functionality):**
```bash
# macOS
brew install yt-dlp

# Ubuntu/Debian
sudo apt install yt-dlp

# pip (cross-platform)
pip3 install yt-dlp
```

**Optional (for videos without subtitles):**
```bash
pip3 install openai-whisper
```

<Callout type="info">

**Whisper Model Sizes:**
- `tiny` - 1GB, fast but less accurate
- `base` - 1GB, good balance
- `small` - 2GB, better accuracy
- `medium` - 5GB, high quality
- `large` - 10GB, best quality (slow)

For most use cases, `base` or `small` models provide excellent results.

</Callout>

## Technical Details

**Subtitle Detection:**
```bash
yt-dlp --list-subs [URL]
```
Shows available caption languages before download.

**Download Process:**
```bash
yt-dlp --write-auto-sub --skip-download [URL]
```
Grabs auto-generated or manual subtitles without downloading video.

**Whisper Fallback:**
```bash
yt-dlp -x --audio-format mp3 [URL]
whisper audio.mp3 --model base
```
Extracts audio and generates transcript using AI.

## Deduplication Algorithm

**Problem:** VTT subtitle files contain duplicates for accessibility
```
00:00:01 --> 00:00:03
Welcome to this tutorial

00:00:01 --> 00:00:03
Welcome to this tutorial

00:00:03 --> 00:00:05
Today we'll learn about React
```

**Solution:** Python script removes consecutive duplicates
```
Welcome to this tutorial
Today we'll learn about React
```

## Best Practices

<Callout type="warning">

**Do:**
- Use subtitle download when available (faster)
- Choose appropriate Whisper model for speed/quality tradeoff
- Review transcript for technical terms (AI may misinterpret jargon)
- Respect video creator's copyright

**Don't:**
- Download transcripts from copyrighted content for commercial redistribution
- Assume 100% accuracy (especially with auto-generated subtitles)
- Use largest Whisper model unless quality is critical (very slow)
- Skip checking if subtitles already exist before using Whisper

</Callout>

## Common Use Cases

**For Students:**
- Tutorial videos → Study notes
- Lecture recordings → Reference material
- Conference talks → Written summaries

**For Researchers:**
- Interview videos → Analysis data
- Documentary content → Citations
- Expert talks → Quote extraction

**For Content Creators:**
- Competitor analysis → Written breakdowns
- Video scripts → Blog post foundations
- Podcast episodes → Show notes

## Language Support

**Subtitle download supports:**
- All languages offered by YouTube creators
- Auto-generated captions in major languages
- Manual captions in creator-specified languages

**Whisper transcription supports:**
- 99+ languages with varying accuracy
- Best performance on English
- Automatic language detection
- Translations available with `--task translate`

## Integration with Tapestry

<Card title="Complete Learning Workflow">

YouTube Transcript is part of the [Tapestry ecosystem](https://github.com/michalparkola/tapestry-skills-for-claude-code):

**Standalone usage:**
Extract transcripts for any purpose

**With Tapestry orchestration:**
1. **YouTube Transcript** - Get clean text ← You are here
2. **Ship-Learn-Next** - Convert to action plan
3. **Ship** - Build something concrete

**One command for full workflow:**
```
tapestry https://youtube.com/watch?v=example
```

</Card>

## Performance

**Subtitle download:**
- Speed: 5-15 seconds (network dependent)
- Accuracy: Varies (auto-captions vs. manual)
- Cost: Free

**Whisper transcription:**
- Speed:
  - `tiny` model: 2-5x real-time
  - `base` model: 1-2x real-time
  - `large` model: 0.5x real-time (slower than video)
- Accuracy: Excellent (especially `medium`+)
- Cost: Free (runs locally)

**Recommendation:** Try subtitles first, use Whisper only when needed.

## Troubleshooting

**"No subtitles available" error:**
- Check `yt-dlp --list-subs [URL]` to verify
- Install Whisper for fallback transcription
- Some videos genuinely have no captions

**Whisper fails with memory error:**
- Use smaller model (`tiny` or `base`)
- Close other applications
- Process shorter video segments

**Duplicate lines not removed:**
- Check Python is installed (needed for deduplication script)
- Manually clean with find/replace in text editor

**Wrong language downloaded:**
- Specify language: `yt-dlp --write-sub --sub-lang es [URL]`
- List available languages: `yt-dlp --list-subs [URL]`

## Advanced Options

**Download specific subtitle format:**
```bash
yt-dlp --write-sub --sub-format vtt/srt [URL]
```

**Translate to English:**
```bash
whisper audio.mp3 --model base --task translate
```

**Keep timestamps:**
```bash
yt-dlp --write-sub --skip-download [URL]
# Use raw VTT file with timestamps preserved
```

## About This Skill

<Callout type="info">
This skill was created by **michalparkola** as part of the [Tapestry Skills for Claude Code](https://github.com/michalparkola/tapestry-skills-for-claude-code) collection.

**Philosophy:** Transform passive video watching into active learning by extracting transcripts that can be turned into action plans, study guides, or reference materials.

**Tools used:** yt-dlp (subtitle download), OpenAI Whisper (transcription), Python (text processing)
</Callout>

---

*Downloads and processes YouTube transcripts for readability, with automatic deduplication and fallback to Whisper transcription for videos without subtitles.*
