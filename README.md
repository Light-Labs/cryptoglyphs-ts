![Cryptoglyphs v1](reference/example.svg)

# cryptoglyphs-ts

Cryptoglyphs are coloured shapes that visualise a transaction or some other kind of data. The purpose of Cryptoglyphs is to make it easier for end-users to verify that a piece of data is the same on two different devices.

It was originally created for use in the [Ryder hardware device](https://ryder.id) to visualise transactions so that users can easily check if the transaction they are about to send has not been tampered with.

The Cryptoglyphs specification is open source and permissively licensed. Everyone is welcome to use it to better secure their wallets.

**Warning: the Cryptoglyphs specification and library is in a prototypal stage and may change. No formal audit has been done.**

# How it works

The library turns a 32-byte hash into eight coloured symbols. It does so by converting the hash into a series of sixteen 16-bit numbers. Each two numbers forms a set where the prior decides the symbol and the latter the colour.

There are sixteen distinct symbols and eight colours making for a total of 128 unique Cryptoglyphs. The shapes are intended to be easily recognisable and the colour palette was chosen to account for the most common types of colour blindness.

## Symbols

![All Cryptoglyph v1 symbols](reference/shapes.svg)

## Colours

![All Cryptoglyph v1 colours](reference/colors.svg)

Colour codes:

- `#332288`
- `#117733`
- `#44AA99`
- `#88CCEE`
- `#DDCC77`
- `#CC6677`
- `#AA4499`
- `#882255`

# Usage

The library is meant to be included in existing TypeScript or JavaScript based projects. It exports two functions:

#### `cryptoglyphs_to_svg(hash: Uint8Array, options: CryptoglyphsSvgOptions): string`

Takes an input `Uint8Array` of length `32` and an object of type `CryptoglyphsSvgOptions` and returns a `string` containing the rendered Cryptoglyphs SVG image. The image can be written to the screen directly.

The `CryptoglyphsSvgOptions` object takes three optional fields:

```ts
type CryptoglyphsSvgOptions = {
	version?: number,
	rows?: number,
	spacing?: number
}
```

- `version`: if defined, must be `1`.
- `rows`: how many rows to draw the Cryptoglyphs on. Set to `1` for eight symbols on one row, or `2` for two rows of four glyphs, and so on. Default `1`.
- `spacing`: spacing between the individual Cryptoglyphs in pixels. Default `1`.

#### `cryptoglyphs(hash: Uint8Array): Cryptoglyphs`

Takes an input `Uint8Array` of length `32` and returns a `Cryptoglyphs` object. It can be used to generate Cryptoglyphs manually in case the built-in SVG option is insufficient. The function is currently considered advanced usage.

The `Cryptoglyphs` object has the following type:

```ts
type Cryptoglyphs = {
	version: number,
	data: CryptoglyphsDataPoint[]
};
```

The version number is always `1` and the data points contain the symbol and color value extracted from each set of bytes.

```ts
type CryptoglyphsDataPoint = { symbol: number, color: number };
```

# Testing

You can play around with Cryptoglyphs using a basic testing environment. Clone this repository, install with `npm install`, followed by `npm run build` and then `npm run dev`. The local environment will be accessible on http://localhost:8080. It allows you to input hashes in hex format and change the rendering options.

# Specification

To turn arbitrary data in a Cryptoglyphs image, it shall first be hashed. The 32-byte hash is used as the input and follows this process:

1. Take a 32-byte input and split it into eight 4-byte groups.
2. Each 4 byte group is turned into two big-endian 16-bit numbers. The first two bytes form the Symbol Value and the second the Color Value.
3. Select the final symbol using the following calculation: `Total Number Of Symbols % Symbol Value`. In the case of v1: `16 % Symbol Value`.
4. Select the final colour using the following calculation: `Total Number of Colors % Color Value`. In the case of v1: `8 % Color Value`
5. Repeat the process for all 4-byte groups.
6. The resulting values are be used to render the Cryptoglyphs.


# License

MIT
