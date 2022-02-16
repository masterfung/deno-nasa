import { Router} from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { getAllPlanets } from "./models/planets.ts";

const router = new Router();

router
.get("/", (ctx) => {
  ctx.response.body = `
  {___     {__      {_         {__ __        {_       
  {_ {__   {__     {_ __     {__    {__     {_ __     
  {__ {__  {__    {_  {__     {__          {_  {__    
  {__  {__ {__   {__   {__      {__       {__   {__   
  {__   {_ {__  {______ {__        {__   {______ {__  
  {__    {_ __ {__       {__ {__    {__ {__       {__ 
  {__      {__{__         {__  {__ __  {__         {__
                  Mission Control API`;
});

router.get("/planets", (ctx) => {
  ctx.response.body = getAllPlanets();
})

export default router;