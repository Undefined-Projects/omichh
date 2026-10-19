# Fuentes locales

`fraunces-omichh.woff2` es Fraunces (SIL Open Font License 1.1, © The Fraunces
Project Authors) instanciada para el sitio: peso 700, `SOFT` 100 y `WONK` 1
fijos, con `opsz` variable. Se obtuvo del subconjunto latino de Google Fonts con
`fontTools.varLib.instancer`:

```python
inst = instancer.instantiateVariableFont(TTFont("fraunces-latin.woff2"), {"wght": 700, "SOFT": 100, "WONK": 1})
inst.flavor = "woff2"; inst.save("fraunces-omichh.woff2")
```

Si se necesita otro peso o estilo, hay que volver a instanciar desde la fuente original.
