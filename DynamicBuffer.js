/* 
Copyright (C) 2012 Oliver Herdin

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


var DEFAULT_SIZE = 512,
	DEFAULT_FACTOR = 2.0;

/**
 * constructor, takes a starting size for the underlying buffer
 * and a factor, in which the buffer grows, if it gets to small.
 * Both have defaults (512 and 2.0).
 */
var DynamicBuffer = module.exports = function(_size, _factor)
{
	this.length = 0;
	this.buffer = new Buffer(_size || DEFAULT_SIZE);
	this.resizeFactor = _factor || DEFAULT_FACTOR;
};

/**
 * append a string to the buffer and return it for chaining
 */
DynamicBuffer.prototype.append = function(_string)
{
	ensureSize.call(this, _string.length);
	this.buffer.write(_string, this.length);
	this.length += Buffer.byteLength(_string);
	return this;
};

/**
 * append a byte to the buffer and return it for chaining
 */
DynamicBuffer.prototype.write = function(_byte)
{
	ensureSize.call(this, 1);
	this.buffer.writeInt8(_byte, this.length);
	this.length += 1;
	return this;
};

/**
 * append a javascript (V8) buffer or DynamicBuffer to this one
 * and return it for chaining
 */
DynamicBuffer.prototype.concat = function(_buffer)
{
	var buffer = "DynamicBuffer" === typeof(_buffer) ? _buffer.buffer : _buffer;
	
	ensureSize.call(this, buffer.length);
	buffer.copy(this.buffer, 0 , this.length);
	this.length += buffer.length;
	return this;
};

/**
 * get a copy of this DynamicBuffer. Changing one of the buffers does
 * not change the other one. Will accept an optional size for the copy.
 * If not given, the new one will be exactly the same as the original.
 */
DynamicBuffer.prototype.clone = function(_newBufferSize, _newResizeFactor)
{
	var size = (_newBufferSize && _newBufferSize >= this.length) ? _newBufferSize : this.buffer.length
		, clone = new DynamicBuffer(size, _newResizeFactor || this.resizeFactor);
	
	clone.concat(this.buffer);
	return clone;
};

/**
 * shrinks this buffer either to the given size, or the length of the current buffer.
 * This method is mainly used to squeeze out the last bytes of memory, or increase the 
 * size for large chunks of data to come  
 */
DynamicBuffer.prototype.resizeUnderlyingBuffer = function(_size)
{
	var oldBuffer = this.buffer;
	this.buffer = new Buffer(_size || this.length);
	oldBuffer.copy(this.buffer);
	return this;
};

/**
 * return a view of the underlying buffer that only contains the written space.
 * Changing that view will change this buffer, too.
 */
DynamicBuffer.prototype.getBuffer = function()
{
	return this.buffer.slice(0, this.length);
};

// ----------------------------------------------------- PRIVATES

/**
 * make sure the underlying buffer is large enough to take the given amount of
 * bytes. If it is not, resize it (that will create a new buffer in the background)
 */
function ensureSize(_additionalDataSize)
{
	var neededSize = this.length + _additionalDataSize;
	if (this.buffer.length < neededSize)
	{
		var oldBuffer = this.buffer;
		/* other possibility: take the current buffer length and multiply 
		 * it with resizeFactor until it is large enough
		 */
		this.buffer = new Buffer(~~(neededSize * this.resizeFactor));
		oldBuffer.copy(this.buffer);
	}
}