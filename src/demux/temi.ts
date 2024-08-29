
enum TimeFieldType {
  None = 0,
  Short = 1,
  Long = 2,
  Reserved = 3,
}

const ntp_epoch_offset = 2208988800; // This is going to break in 2036

export const parseTimelineDescriptorNtpTimestamp = (data: Uint8Array, pos: number, len: number): number | undefined => {
  let has_timestamp: TimeFieldType = (data[pos] & 0xC0) >>> 6;
  let has_npt = (data[pos] & 0x20) >>> 5;
  if (!has_npt) return undefined;

  let data_view = new DataView(data.buffer, data.byteOffset + pos + 3, len - 3);
  let offset = has_timestamp !== 0 ? 12 : 0;
  const seconds = data_view.getUint32(offset);
  const fraction = data_view.getUint32(offset + 4);
  return (seconds - ntp_epoch_offset) * 1000 + (((fraction * 1000) / 0x100000000) | 0);
}
