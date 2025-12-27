# Cálculo Numérico

## Teorema (método de Newton)

Sea $f:(a,b)\to\mathbb{R}$ una función de clase $C^2$ en $(a,b)$. Supongamos que en $(a,b)$:

1. $f'(x)$ tiene signo constante y no se anula en $(a,b)$ (crecimiento o decrecimiento estricto en el intervalo).
2. $f''(x)$ tiene signo constante y no se anula en $(a,b)$ (convexidad o concavidad global en el intervalo).
3. Existe una raíz $\alpha\in (a,b)$.
4. Se toma $x_0\in(a,b)$ con la condición de arranque $f(x_0)\,f''(x_0)>0$

Definimos la sucesión de Newton
$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$$

Entonces se cumplen:

1. **Unicidad de la raíz**: la raíz $\alpha$ en $(a,b)$ es única.
2. **Convergencia**: la sucesión $\{x_n\}$ converge a $\alpha$.
3. **Estimaciones del error**: si además existen constantes $0<m\le M$ tales que
   $$0<m\le |f'(x)|\le M \quad \text{para todo } x \text{ en un intervalo que contiene a } \alpha \text{ y a } x_n$$
   entonces para todo $n\ge 1$ se verifican
   $$|x_n-\alpha|\le \frac{|f(x_n)|}{m},\qquad|x_n-\alpha|\le \frac{M-m}{m}\,|x_n-x_{n-1}|$$

### Demostración

Como $f'$ tiene signo constante y no se anula, $f$ es estrictamente monótona en $(a,b)$.
Una función estrictamente monótona puede cortar el eje $x$ a lo sumo una vez.
Por tanto, si existe una raíz $\alpha\in[a,b]$, es única.

Sin pérdida de generalidad, demostramos el caso típico
$$f'(x)>0 \quad\text{y}\quad f''(x)>0 \ \ \text{en } (a,b)$$
(es decir, $f$ creciente y convexa). Los otros casos (signos cambiados) son análogos invirtiendo desigualdades.

Para $f$ convexa, para todo $x,y\in(a,b)$ se cumple
$$f(y)\ge f(x)+f'(x)(y-x)$$
Tomando $y=\alpha$ (con $f(\alpha)=0$) queda
$$0\ge f(x)+f'(x)(\alpha-x)\quad\Longrightarrow\quad f'(x)(x-\alpha)\ge f(x)$$
Dividiendo por $f'(x)>0$,
$$x-\frac{f(x)}{f'(x)}\ge \alpha$$
Pero $x-\frac{f(x)}{f'(x)}=N(x)$ es el operador de Newton, luego
$$x_{n+1}\ge \alpha\quad\text{siempre que }x_n\in(a,b)$$

La condición $f(x_0)f''(x_0)>0$ y $f''>0$ implica $f(x_0)>0$. Como $f$ es creciente y $f(\alpha)=0$, esto fuerza $x_0>\alpha$.

Si $x_n>\alpha$, entonces $f(x_n)>0$ y $f'(x_n)>0$, por tanto
$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}<x_n$$
Luego
$$\alpha \le x_{n+1} < x_n$$
Así, $\{x_n\}$ es decreciente y está acotada inferiormente por $\alpha$, luego converge:
existe $\ell=\lim x_n$ con $\ell\ge \alpha$.

Pasando a límite en la iteración (usando continuidad de $f$ y $f'$ y que $f'(x)\neq 0$):
$$\ell=\ell-\frac{f(\ell)}{f'(\ell)} \quad\Longrightarrow\quad f(\ell)=0$$
Por unicidad de la raíz, $\ell=\alpha$. Se concluye que $x_n\to \alpha$.

A partir de aquí suponemos que en el intervalo donde viven $\alpha$ y los iterados se cumple
$$0<m\le |f'(x)|\le M$$

Por el Teorema del Valor Medio entre $x_n$ y $\alpha$, existe $\xi_n$ entre ambos tal que
$$f(x_n)-f(\alpha)=f'(\xi_n)(x_n-\alpha)$$
Como $f(\alpha)=0$,
$$|f(x_n)|=|f'(\xi_n)|\,|x_n-\alpha|\ge m\,|x_n-\alpha|$$
Despejando,
$$|x_n-\alpha|\le \frac{|f(x_n)|}{m}$$
Ahora aplicamos el TVM a $f(x_{n-1})-f(\alpha)$: existe $\eta_{n-1}$ entre $x_{n-1}$ y $\alpha$ tal que
$$f(x_{n-1})=f'(\eta_{n-1})(x_{n-1}-\alpha)$$
Definimos
$$r:=\frac{f'(\eta_{n-1})}{f'(x_{n-1})}$$
donde el cociente tiene sentido porque $f'(x_{n-1})\neq 0$.
A partir de la fórmula de Newton:
$$x_n-x_{n-1}=-\frac{f(x_{n-1})}{f'(x_{n-1})}=-\frac{f'(\eta_{n-1})}{f'(x_{n-1})}(x_{n-1}-\alpha)=-r\,(x_{n-1}-\alpha)$$
De aquí, tomando valores absolutos,
$$|x_n-x_{n-1}|=r\,|x_{n-1}-\alpha|$$
Además
$$x_n-\alpha=(x_{n-1}-\alpha)+(x_n-x_{n-1})=(1-r)(x_{n-1}-\alpha)$$
luego
$$|x_n-\alpha|=(1-r)\,|x_{n-1}-\alpha|$$
Dividiendo ambas expresiones:
$$\frac{|x_n-\alpha|}{|x_n-x_{n-1}|}=\frac{1-r}{r}$$

Ahora acotamos $r$. Como $|f'(\eta_{n-1})|\ge m$ y $|f'(x_{n-1})|\le M$,
$$r=\frac{|f'(\eta_{n-1})|}{|f'(x_{n-1})|}\ge \frac{m}{M}$$
Además, dado que estamos suponiendo $f''>0$, en $(a,b)$, $f'$ es creciente y como $\alpha\leq x_{n-1}$ se tiene que $r\le 1$.
Por tanto $r\in\left[\frac{m}{M},1\right]$, y como $\phi(r)=\frac{1-r}{r}=\frac1r-1$ es decreciente,
$$\frac{1-r}{r}\le \frac{1-\frac{m}{M}}{\frac{m}{M}}=\frac{M-m}{m}$$
Concluimos,
$$|x_n-\alpha|\le \frac{M-m}{m}\,|x_n-x_{n-1}|$$
Queda demostrada la segunda estimación.