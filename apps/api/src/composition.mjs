import {InventoryLedger,PricingCatalog} from '@aegis/domain';
import {VersionedRepository,AppendOnlyJournal,TtlCache} from '@aegis/persistence';
import {InMemoryMessageBus,TransactionalOutbox} from '@aegis/messaging';
import {MetricsRegistry,createLogger} from '@aegis/observability';
import {FulfillmentWorkflow,SimulatedPaymentGateway} from '@aegis/workflows';
export function createApplication({logger=createLogger({service:'aegis-api'}),seed=true}={}){
  const inventory=new InventoryLedger();const pricing=new PricingCatalog();
  const orders=new VersionedRepository();const journal=new AppendOnlyJournal();
  const bus=new InMemoryMessageBus();const outbox=new TransactionalOutbox();
  const payments=new SimulatedPaymentGateway();const metrics=new MetricsRegistry();
  const cache=new TtlCache();
  if(seed){const items=[['LAPTOP-14',20,89900],['DOCK-USB-C',85,12900],['KEYBOARD-MECH',130,7500],['MONITOR-27',45,29900],['HEADSET-PRO',60,15900]];
    for(const [sku,qty,cents] of items){inventory.receive(sku,qty);pricing.set(sku,cents)}}
  bus.subscribe('*',event=>{journal.append(event);metrics.increment('events_consumed_total')});
  const workflow=new FulfillmentWorkflow({inventory,pricing,payments,orders,outbox,metrics,logger});
  return {inventory,pricing,orders,journal,bus,outbox,payments,metrics,cache,workflow,logger};
}
