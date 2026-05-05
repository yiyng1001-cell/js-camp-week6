// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
    // 發送 GET 請求 (預設即為 GET)
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
    const data = await response.json();
    console.log(data)
    return data.products; // 回傳產品陣列
	
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求 
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
    const data = await response.json();

    const { carts,total,finalTotal }=data
    // 回傳包含 carts 陣列與金額的物件z
    return { carts, total, finalTotal
    };
} 

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
    try {
        const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
         
        // 檢查 HTTP 狀態碼是否在 200-299 之間
        if (!response.ok) {
            return { success: false, error: `伺服器回報錯誤: ${response.status}` };
        }

        const data = await response.json();
        return { success: true, data: data.products };
    } catch (error) {
        // 捕捉網路斷線或語法錯誤
        return { success: false, error: error.message };
    }
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
async function addToCart(productId, quantity) {
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 告訴伺服器我們傳送的是 JSON
        },
        body: JSON.stringify({
            data: {
                productId: productId,
                quantity: quantity
            }
        })
    });
    return await response.json();
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                id: cartId,
                quantity: quantity
            }
        })
    });
    return await response.json();
}
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`, {
        method: 'DELETE'
    });
    return await response.json();
}
/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
        method: 'DELETE'
    });
    return await response.json();
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
   1xx, 請求已收到，繼續處理。
   2xx, 請求成功被伺服器接收並理解 200 OK
   3xx, 需要進行額外操作以完成請求 301 Moved Permanently
   4xx, 請求包含錯誤語法或無法完成 404 Not Found
   5xx, 伺服器處理請求時發生錯誤 500 Internal Server Error

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
   GET:從伺服器「取得」資料。
   POST:在伺服器「新增」一筆資料。
   PATCH:更更新伺服器上的「部分」資料。
   PUT:更新伺服器上的整筆資料 (全部替換)。
   DELETE:刪除伺服器上的資料。



3. 什麼是 RESTful API？
   答：ESTful API 是一種設計風格，它使用 URL (資源名稱) 來定位資源，並利用 HTTP 動詞 (GET/POST/...) 來決定操作動作。例如：

GET /products 代表「取得所有產品」。

DELETE /products/123 代表「刪除 ID 為 123 的產品」。


*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
