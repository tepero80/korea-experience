'use client';
import { useState } from 'react';
import { track } from '@/lib/analytics';
import Icon from './Icon';
interface Props {
  id: string;
  title: string;
  url: string;
  summary: string;
  facts: string[];
  checkedAt?: string;
  category: string;
}
function lines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight: number,
  maxLines = 10,
) {
  const words = text.split(/\s+/).flatMap((word) => {
    if (ctx.measureText(word).width <= width) return [word];
    const chunks: string[] = [];
    let part = '';
    for (const character of word) {
      if (part && ctx.measureText(part + character).width > width) {
        chunks.push(part);
        part = '';
      }
      part += character;
    }
    if (part) chunks.push(part);
    return chunks;
  });
  let line = '';
  const rows: string[] = [];
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      rows.push(line);
      line = word;
    } else line = next;
  }
  if (line) rows.push(line);
  const visible = rows.slice(0, maxLines);
  if (rows.length > maxLines) {
    let last = visible[maxLines - 1];
    while (last && ctx.measureText(last + '…').width > width) last = last.slice(0, -1);
    visible[maxLines - 1] = last + '…';
  }
  for (const row of visible) {
    ctx.fillText(row, x, y);
    y += lineHeight;
  }
  return y;
}
export default function ShareActions(props: Props) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const text = [
    props.title,
    props.summary,
    ...props.facts.slice(0, 2),
    props.checkedAt
      ? `Information checked ${props.checkedAt}. Confirm current conditions before booking.`
      : '',
    props.url,
  ]
    .filter(Boolean)
    .join('\n');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Summary and link copied.');
      track('share_copy', { content_id: props.id });
    } catch {
      setStatus('Copy was unavailable. Select the link below to copy it manually.');
    }
  }
  async function share() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({
        title: props.title,
        text: [
          props.summary,
          ...props.facts.slice(0, 2),
          props.checkedAt ? `Checked ${props.checkedAt}; confirm current conditions.` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        url: props.url,
      });
      setStatus('Handed to your device’s share sheet.');
      track('share_handoff', { content_id: props.id });
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus('Sharing was unavailable. Copy the summary instead.');
    }
  }
  async function download(story = false) {
    setBusy(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = story ? 1920 : 1350;
      const c = canvas.getContext('2d');
      if (!c) throw new Error('Canvas unavailable');
      c.fillStyle = '#faf9f5';
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = '#20322e';
      c.fillRect(0, 0, 1080, 34);
      c.fillStyle = '#b15a25';
      c.font = 'bold 22px Arial';
      c.fillText('KOREA EXPERIENCE  /  SAVE FOR YOUR TRIP', 80, 110);
      c.font = '22px Arial';
      c.fillStyle = '#62716b';
      c.fillText(props.category, 80, 175);
      c.fillStyle = '#20322e';
      c.font = story ? '64px Georgia' : '52px Georgia';
      let y = lines(c, props.title, 80, 260, 900, story ? 77 : 64, 3) + 25;
      c.font = '27px Arial';
      c.fillStyle = '#62716b';
      y = lines(c, props.summary, 80, y, 900, 40, 3) + 25;
      c.font = '30px Arial';
      for (const fact of props.facts.slice(0, story ? 3 : 2)) {
        c.fillStyle = '#e9eee7';
        c.fillRect(65, y - 30, 950, 140);
        c.fillStyle = '#20322e';
        lines(c, fact, 90, y + 10, 890, 42, 3);
        y += 165;
      }
      c.fillStyle = '#62716b';
      c.font = '21px Arial';
      if (props.checkedAt)
        c.fillText(`Checked ${props.checkedAt} · Conditions may change`, 80, canvas.height - 155);
      c.fillText('Find the full guide and official sources:', 80, canvas.height - 110);
      c.font = '23px Arial';
      lines(c, props.url.replace('https://', ''), 80, canvas.height - 65, 920, 27, 2);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Image unavailable'))),
          'image/png',
        ),
      );
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = `korea-experience-${props.id.replace(/[^a-z0-9-]/gi, '-')}-${story ? 'story' : 'card'}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus('Image downloaded. Attach it in your preferred app.');
      track('share_card_download', { content_id: props.id, format: story ? 'story' : 'feed' });
    } catch {
      setStatus('The image could not be made. Copy the summary and link instead.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="share-box no-print" aria-label="Share this guide">
      <div>
        <p className="eyebrow">Useful enough to pass along</p>
        <h2>Keep the important details together.</h2>
        <p>Share a summary with the conditions and a link to the full guide.</p>
      </div>
      <div className="share-buttons">
        <button className="action-button" onClick={share}>
          <Icon name="share" />
          Share
        </button>
        <button className="action-button" onClick={copy}>
          Copy summary
        </button>
        <button className="action-button" disabled={busy} onClick={() => void download(false)}>
          {busy ? 'Creating…' : 'Download card'}
        </button>
        <button className="action-button" disabled={busy} onClick={() => void download(true)}>
          Story image
        </button>
        <a
          className="action-button"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('share_channel_click', { content_id: props.id, channel: 'facebook' })
          }
        >
          Facebook
        </a>
        <a
          className="action-button"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('share_channel_click', { content_id: props.id, channel: 'x' })}
        >
          X
        </a>
        <a
          className="action-button"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('share_channel_click', { content_id: props.id, channel: 'whatsapp' })
          }
        >
          WhatsApp
        </a>
        <a
          className="action-button"
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(props.url)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('share_channel_click', { content_id: props.id, channel: 'line' })}
        >
          LINE
        </a>
      </div>
      <p className="share-status" role="status">
        {status}
      </p>
      <a className="share-source-url" href={props.url}>
        {props.url}
      </a>
    </section>
  );
}
