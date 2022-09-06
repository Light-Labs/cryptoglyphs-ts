export const version = 1;

export type CryptoglyphsDataPoint = { symbol: number, colour: number };

export type Cryptoglyphs = {
	version: number,
	data: CryptoglyphsDataPoint[]
};

export type CryptoglyphsSvgOptions = {
	version?: number,
	rows?: number,
	spacing?: number
};

export const palette: string[] = [
	'#332288',
	'#117733',
	'#44AA99',
	'#88CCEE',
	'#DDCC77',
	'#CC6677',
	'#AA4499',
	'#882255'
];

export const shapes: string[] = [
	'm 100 50 a 50 50 0 1 1 -100 0 a 50 50 0 1 1 100 0 Z',
	'm 100 50 a 50 50 0 1 1 -100 0 a 50 50 0 1 1 100 0 m -20 0 a 30 30 0 0 0 -60 0 a 30 30 0 0 0 60 0 Z',
	'a 50 50 0 0 1 0 100 Z m 100 100 a 50 50 0 0 1 0 -100 Z',
	'a 50 50 0 0 1 0 100 Z m 0 80 a 30 30 0 0 0 0 -60 Z v -60 h 20 v 60 h -20 Z m 100 20 a 50 50 0 0 1 0 -100 Z m 0 -80 a 30 30 0 0 0 0 60 Z v 60 h -20 v -60 Z',
	'a 50 50 0 0 0 100 0 Z m 100 100 a 50 50 0 0 0 -100 0 Z',
	'a 50 50 0 0 0 100 0 Z m 80 0 a 30 30 0 0 1 -60 0 Z h -60 v 20 h 60 Z m -80 100 a 50 50 0 0 1 100 0 Z m 80 0 a 30 30 0 0 0 -60 0 Z h -60 v -20 h 60 Z',
	'a 100 100 0 0 1 100 100 l -100 0 Z',
	'a 100 100 0 0 1 100 100 l -100 0 Z m 80 100 a 80 80 0 0 0 -80 -80 l 0 80 Z h -80 v -80 h 20 v 60 h 60 Z',
	'm 0 100 a 100 100 0 0 1 100 -100 l 0 100 Z',
	'm 0 100 a 100 100 0 0 1 100 -100 l 0 100 Z m 100 -80 a 80 80 0 0 0 -80 80 l 80 0 Z v 80 h -80 v -20 h 60 v -60 Z',
	'm 100 0 a 100 100 0 0 1 -100 100 l 0 -100 Z',
	'm 100 0 a 100 100 0 0 1 -100 100 l 0 -100 Z m -100 80 a 80 80 0 0 0 80 -80 l -80 0 Z v 20 m 0 -20 v -80 h 80 v 20 h -60 v 60 Z',
	'a 100 100 0 0 0 100 100 l 0 -100 Z',
	'a 100 100 0 0 0 100 100 l 0 -100 Z m 100 80 a 80 80 0 0 1 -80 -80 l 80 0 Z v -80 h -80 v 20 h 60 v 60 Z',
	'h 100 v 100 h -100 Z',
	'h 100 v 100 h -100 Z m 20 20 v 60 h 60 v -60 Z',
];

export function cryptoglyphs(hash: Uint8Array): Cryptoglyphs {
	if (hash.byteLength !== 32)
		throw new Error("cryptoglyphs: expects exactly 32 bytes");
	const view = new DataView(hash.buffer, hash.byteOffset, hash.byteLength);
	let data: CryptoglyphsDataPoint[] = [];
	for (let offset = 0; offset < view.byteLength; offset += 4)
		data.push({ symbol: view.getUint16(offset, false), colour: view.getUint16(offset + 2, false) });
	return { version, data };
}

export function cryptoglyphs_to_svg(hash: Uint8Array, options: CryptoglyphsSvgOptions): string {
	if (hash.byteLength !== 32)
		throw new Error("cryptoglyphs_to_svg: expects exactly 32 bytes");
	const requested_version = options.version ?? version;
	const rows = options.rows ? (options.rows < 8 ? options.rows : 8) : 1;
	const elements_per_row = Math.ceil(8 / rows);
	const spacing = options.spacing ?? 1;
	const size = 100 + spacing;
	const colours = cryptoglyphs(hash);
	if (colours.version !== requested_version)
		throw new Error(`cryptoglyphs_to_svg: unexpected version ${requested_version}, result version: ${colours.version}`);
	let svg = `<svg viewbox="0 0 ${elements_per_row * size - spacing} ${rows * size - spacing}" xmlns="http://www.w3.org/2000/svg"><!-- Ryder Cryptoglyphs version ${colours.version} -->`;
	let index = 0;
	for (let y = 0; y < rows; ++y)
		for (let x = 0; x < elements_per_row && index < colours.data.length; ++index, ++x)
			svg += `<path d="M ${x * size} ${y * size} ${shapes[colours.data[index].symbol % shapes.length]}" fill="${palette[colours.data[index].colour % palette.length]}"/>`;
	svg += `</svg>`;
	return svg;
}
