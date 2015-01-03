s26 Sprites
===========

s26 sprites is a module for loading, manipulating & styling 2.5d/isometric
sprites. The name comes from 26.565°, the degrees of the isometric axes in computer games.

Overview
--------

This library is intended to be an opinionated "overview" of the loading and processing of game sprites.

The idea is as follows:

* Game assets are created in SVG using a predetermined color palette.
* Said color palette is manipulated on the client to create somewhat procedurally generated "renditions" of each asset.

The following is an overview of the s26 internals:

* Index - Entry point to the library. Contains files & sprites.
* File - A single SVG file. Can be shared across multiple sprites (as a sprite sheet)
* Sprite - A single game asset, such as a house or tree. Contains one file and multiple renditions. May optionally include sprite sheet information such as position & size.
** Files - A reference to the global store above to reduce duplication.
** Rendition - A variation on the sprite. Includes colour & rotation info. There is always at least one rendition of "default", but you can add more.

Usage
-----

This is not really ready to be used, but if you insist you can probably load it as a straight up NPM module and build it with Browserify.
