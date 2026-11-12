const products = [
  {id:1,name:"Aero Wireless Headphones",category:"Tech",price:8490,oldPrice:9990,emoji:"🎧",badge:"BESTSELLER",tone:1,description:"Immersive sound, soft memory-foam cushions and all-day comfort. A considered companion for focus, travel and everything in between."},
  {id:2,name:"Orbit Smart Watch",category:"Tech",price:12990,oldPrice:null,emoji:"⌚",badge:"NEW ARRIVAL",tone:2,description:"A clean, modern smartwatch concept with activity insights, notifications and a refined everyday profile."},
  {id:3,name:"Studio Desk Lamp",category:"Lifestyle",price:4590,oldPrice:null,emoji:"💡",badge:"DESIGN PICK",tone:3,description:"A warm pool of light for late-night ideas and slow mornings. Minimal form, practical function."},
  {id:4,name:"Everyday Carry Bottle",category:"Lifestyle",price:1890,oldPrice:2290,emoji:"🧴",badge:"−17%",tone:4,description:"A reusable bottle designed to move with you. Simple, durable and ready for everyday hydration."},
  {id:5,name:"Sonic Mini Speaker",category:"Tech",price:5490,oldPrice:null,emoji:"🔊",badge:"POPULAR",tone:1,description:"Compact size, room-filling energy. Bring your favourite soundtrack to your desk, kitchen or weekend away."},
  {id:6,name:"Canvas Weekender",category:"Accessories",price:6790,oldPrice:null,emoji:"👜",badge:"CURATED",tone:2,description:"A versatile carryall with a relaxed silhouette and room for the essentials. Made for short trips and long days."},
  {id:7,name:"Minimal Card Holder",category:"Accessories",price:2190,oldPrice:null,emoji:"👛",badge:"EVERYDAY",tone:3,description:"Keep your daily essentials close with a slim, uncomplicated card holder."},
  {id:8,name:"Focus Notebook Set",category:"Lifestyle",price:1490,oldPrice:null,emoji:"📓",badge:"STAFF PICK",tone:4,description:"A thoughtful notebook set for plans, sketches, lists and ideas that deserve a place to land."}
];
let activeCategory = "All";
let cart = JSON.parse(localStorage.getItem("orbitCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("orbitWishlist") || "[]");
const $ = s => document.querySelector(s);
const money = n => "KSh " + Number(n).toLocaleString("en-KE");
const save = () => { localStorage.setItem("orbitCart",JSON.stringify(cart)); localStorage.setItem("orbitWishlist",JSON.stringify(wishlist)); };
const toast = message => { const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2400); };

function renderProducts(){
  const query=$("#searchInput").value.trim().toLowerCase();
  let list=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(`${p.name} ${p.category} ${p.description}`).toLowerCase().includes(query));
  const sort=$("#sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  $("#productGrid").innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-visual tone-${p.tone}" data-view="${p.id}" role="button" tabindex="0" aria-label="View ${p.name}">
        <span class="product-badge">${p.badge}</span><span class="product-emoji">${p.emoji}</span>
        <button class="wish-btn ${wishlist.includes(p.id)?"active":""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
        <button class="quick-view" data-view="${p.id}">Quick view</button>
      </div>
      <div class="product-meta"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div></div>
    </article>`).join("");
  $("#emptyState").classList.toggle("hidden",list.length!==0);
}
function updateCounts(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  $("#cartCount").textContent=count; $("#drawerCount").textContent=`(${count})`;
  $("#wishlistCount").textContent=wishlist.length;
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({id,qty:1});
  save();renderCart();updateCounts();toast("Added to your bag");
}
function toggleWish(id){
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  save();renderProducts();updateCounts();toast(wishlist.includes(id)?"Saved to your wishlist":"Removed from wishlist");
}
function renderCart(){
  const items=$("#cartItems");
  items.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); if(!p)return "";
    return `<div class="cart-row"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${p.category}</small><strong>${money(p.price*item.qty)}</strong><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}">Remove</button></div>`;
  }).join("");
  const empty=cart.length===0; $("#cartEmpty").classList.toggle("hidden",!empty);$("#cartSummary").classList.toggle("hidden",empty);
  const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  $("#cartSubtotal").textContent=money(subtotal);$("#checkoutTotal").textContent=money(subtotal);updateCounts();
}
function openCart(){renderCart();$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");$("#overlay").classList.add("active");document.body.style.overflow="hidden";}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");$("#overlay").classList.remove("active");document.body.style.overflow="";}
function showProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  $("#productModalContent").innerHTML=`<div class="product-detail"><div class="detail-visual tone-${p.tone}">${p.emoji}</div><div class="detail-copy"><p class="eyebrow">${p.category.toUpperCase()} / ORBIT EDIT</p><h2>${p.name}</h2><div class="detail-price">${money(p.price)}</div><p class="detail-description">${p.description}</p><p class="detail-stock">● Available — ready to add to your bag</p><div class="detail-actions"><button class="btn btn-primary" data-add="${p.id}">Add to bag <span>+</span></button><button class="btn btn-outline" data-wish="${p.id}">♡ Save</button></div></div></div>`;
  $("#productModal").classList.remove("hidden");
}
function closeProduct(){$("#productModal").classList.add("hidden");}
function openCheckout(){if(!cart.length){toast("Your bag is empty");return;}closeCart();$("#checkoutSuccess").classList.add("hidden");$("#checkoutForm").classList.remove("hidden");$("#checkoutModal").classList.remove("hidden");}
function closeCheckout(){$("#checkoutModal").classList.add("hidden");}
function resetFilters(){activeCategory="All";$("#searchInput").value="";$("#sortSelect").value="featured";document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.category==="All"));renderProducts();}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){e.stopPropagation();addToCart(Number(add.dataset.add));if(!$("#productModal").classList.contains("hidden"))closeProduct();}
  const wish=e.target.closest("[data-wish]");if(wish){e.stopPropagation();toggleWish(Number(wish.dataset.wish));}
  const view=e.target.closest("[data-view]");if(view&&!e.target.closest("[data-wish]"))showProduct(Number(view.dataset.view));
  const qty=e.target.closest("[data-qty]");if(qty){const id=Number(qty.dataset.qty),item=cart.find(x=>x.id===id);if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save();renderCart();}}
  const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));save();renderCart();}
  const tab=e.target.closest(".filter-tab");if(tab){activeCategory=tab.dataset.category;document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b===tab));renderProducts();}
  const category=e.target.closest("[data-category].collection-card");if(category){activeCategory=category.dataset.category;document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.category===activeCategory));renderProducts();$("#shop").scrollIntoView({behavior:"smooth"});}
});
$("#cartBtn").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",closeCart);$("#checkoutBtn").addEventListener("click",openCheckout);
$("#closeProduct").addEventListener("click",closeProduct);$("#closeCheckout").addEventListener("click",closeCheckout);
$("#productModal").addEventListener("click",e=>{if(e.target.id==="productModal")closeProduct();});
$("#checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")closeCheckout();});
$("#searchInput").addEventListener("input",renderProducts);$("#sortSelect").addEventListener("change",renderProducts);
$("#resetFilters").addEventListener("click",resetFilters);$("#viewAll").addEventListener("click",e=>{e.preventDefault();resetFilters();});
$("#wishlistBtn").addEventListener("click",()=>{activeCategory="All";$("#searchInput").value="";renderProducts();toast(wishlist.length?`You have ${wishlist.length} saved item(s) — look for the hearts.`:"Your wishlist is empty");});
$("#menuToggle").addEventListener("click",()=>$(".main-nav").classList.toggle("open"));
$(".main-nav").addEventListener("click",e=>{if(e.target.tagName==="A")$(".main-nav").classList.remove("open");});
$(".search-toggle").addEventListener("click",()=>{$("#shop").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#searchInput").focus(),500);});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Thanks for joining the ORBIT letter!");e.target.reset();});
$("#checkoutForm").addEventListener("submit",e=>{e.preventDefault();if(!cart.length)return;const order={reference:"ORB-"+Date.now().toString().slice(-7),createdAt:new Date().toISOString(),customer:Object.fromEntries(new FormData(e.target)),items:cart,total:cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0)};sessionStorage.setItem("orbitDemoOrder",JSON.stringify(order));$("#checkoutForm").classList.add("hidden");$("#checkoutSuccess").classList.remove("hidden");cart=[];save();updateCounts();});
$("#finishCheckout").addEventListener("click",()=>{closeCheckout();renderCart();toast("Thank you for exploring ORBIT");});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();