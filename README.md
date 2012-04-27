# DynamicBuffer, a wrapper around node.js Buffer class

The Buffer class of node.js by default cannot be used as buffer to concatenate strings, like StringBuilder known from java [http://docs.oracle.com/javase/7/docs/api/java/lang/StringBuilder.html].
This module contains a wrapper around node.js Buffer to concatenate strings into a Buffer, while automatically creating larger Buffers in the background, if more space is needed.

    /**
     * constructor, takes a starting size for the underlying buffer
     * and a factor, in which the buffer grows, if it gets to small.
     * Both have defaults (512 and 2.0).
     */
    var DynamicBuffer = module.exports = function(_size, _factor)

    /**
     * append a string to the buffer and return it for chaining
     */
    DynamicBuffer.prototype.append = function(_string)

    /**
     * append a byte to the buffer and return it for chaining
     */
    DynamicBuffer.prototype.write = function(_byte)

    /**
     * append a javascript (V8) buffer or DynamicBuffer to this one
     * and return it for chaining
     */
    DynamicBuffer.prototype.concat = function(_buffer)

    /**
     * get a copy of this DynamicBuffer. Changing one of the buffers does
     * not change the other one. Will accept an optional size for the copy.
     * If not given, the new one will be exactly the same as the original.
     */
    DynamicBuffer.prototype.clone = function(_newBufferSize, _newResizeFactor)

    /**
     * shrinks this buffer either to the given size, or the length of the current buffer.
     * This method is mainly used to squeeze out the last bytes of memory, or increase the
     * size for large chunks of data to come
     */
    DynamicBuffer.prototype.resizeUnderlyingBuffer = function(_size)

    /**
     * return a view of the underlying buffer that only contains the written space.
     * Changing that view will change this buffer, too.
     */
    DynamicBuffer.prototype.getBuffer = function()